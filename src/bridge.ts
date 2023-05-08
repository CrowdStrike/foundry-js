import { v4 as uuidv4 } from 'uuid';

import { VERSION } from './apis/version';

import type { RequestApi } from './apis/available-apis';

type Message = unknown;

type CommunicationMessageId = string;

export interface ReceivedMessage {
  meta: { __csMessageId__: CommunicationMessageId };
  payload: unknown;
}

interface PostMessageParams {
  type?: RequestApi;
}

export class Bridge {
  private pendingMessages = new Map<
    CommunicationMessageId,
    (result: never) => void
  >();

  private callbackHandlers: ((data: any) => void)[] = [];

  private targetOrigin = '*';

  constructor() {
    window.addEventListener('message', this.handleMessage);
  }

  public destroy() {
    window.removeEventListener('message', this.handleMessage);
  }

  public setOrigin(origin: string) {
    this.targetOrigin = origin;
  }

  // TODO: what to do if we can't resolve back the promise?
  async postMessage<T>(
    payload: Message,
    { type }: PostMessageParams = {}
  ): Promise<T> {
    return new Promise((resolve) => {
      const __csMessageId__ = uuidv4();

      this.pendingMessages.set(__csMessageId__, resolve);

      window.parent.postMessage(
        {
          payload,
          meta: {
            __csMessageId__,
            type,
            version: VERSION,
          },
        },
        this.targetOrigin
      );
    });
  }

  get message() {
    return {
      on: (callback: (data: any) => void) => {
        this.callbackHandlers.push(callback);
      },
      off: (callback: (data: any) => void) => {
        this.callbackHandlers = this.callbackHandlers.filter(
          (handler) => handler !== callback
        );
      },
    };
  }

  private handleMessage = (event: MessageEvent<ReceivedMessage>) => {
    const csMessageId = event?.data?.meta?.__csMessageId__;

    if (csMessageId === undefined || csMessageId === null) {
      for (const callback of this.callbackHandlers) {
        callback(event.data);
      }

      return;
    }

    const callback = this.pendingMessages.get(csMessageId);

    if (!callback) {
      throw new Error(`Received unexpected message`);
    }

    this.pendingMessages.delete(csMessageId);

    callback(event.data.payload as never);
  };
}
