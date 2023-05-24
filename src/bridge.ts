import { v4 as uuidv4 } from 'uuid';

import { isValidResponse } from './utils';
import { VERSION } from './apis/version';

import type {
  DataUpdateMessage,
  LocalData,
  MessageEnvelope,
  PayloadOf,
  RequestMessage,
  ResponseFor,
  ResponseMessage,
} from './types';

const CONNECTION_TIMEOUT = process.env.VITEST ? 100 : 5000;

interface BridgeOptions<DATA extends LocalData> {
  onDataUpdate?: (event: DataUpdateMessage<DATA>) => void;
}

export class Bridge<DATA extends LocalData = LocalData> {
  private onDataUpdate: BridgeOptions<DATA>['onDataUpdate'];
  private pendingMessages = new Map<
    string,
    (result: PayloadOf<ResponseMessage>) => void
  >();

  private targetOrigin = '*';

  constructor({ onDataUpdate }: BridgeOptions<DATA> = {}) {
    this.onDataUpdate = onDataUpdate;

    window.addEventListener('message', this.handleMessage);
  }

  public destroy() {
    window.removeEventListener('message', this.handleMessage);
  }

  public setOrigin(origin: string) {
    this.targetOrigin = origin;
  }

  async postMessage<REQ extends RequestMessage>(
    message: REQ
  ): Promise<PayloadOf<ResponseFor<REQ, DATA>>> {
    return new Promise((resolve, reject) => {
      const messageId = uuidv4();

      const timeoutTimer = setTimeout(() => {
        reject(
          new Error(
            `Waiting for response from foundry host for "${message.type}" message (ID: ${messageId}) timed out after ${CONNECTION_TIMEOUT}ms`
          )
        );
      }, CONNECTION_TIMEOUT);

      this.pendingMessages.set(messageId, (result) => {
        clearTimeout(timeoutTimer);
        resolve(result as PayloadOf<ResponseFor<REQ, DATA>>);
      });

      const eventData: MessageEnvelope<REQ> = {
        message,
        meta: {
          messageId,
          version: VERSION,
        },
      };

      window.parent.postMessage(eventData, this.targetOrigin);
    });
  }

  private handleMessage = (
    event: MessageEvent<MessageEnvelope<ResponseMessage<DATA>> | unknown>
  ) => {
    if (!isValidResponse<DATA>(event)) {
      return;
    }

    const message = event.data.message;

    if (message.type === 'data') {
      this.onDataUpdate?.(message);

      // data update events are unidirectional and originated from the host, so there cannot be a callback waiting for this message
      return;
    }

    const { messageId } = event.data.meta;
    const callback = this.pendingMessages.get(messageId);

    if (!callback) {
      throw new Error(`Received unexpected message`);
    }

    this.pendingMessages.delete(messageId);

    callback(message.payload);
  };
}
