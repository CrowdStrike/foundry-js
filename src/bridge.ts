import { v4 as uuidv4 } from 'uuid';

import { VERSION } from './apis/version';
import { isValidResponse } from './utils';

import type {
  BroadcastMessage,
  DataUpdateMessage,
  LivereloadMessage,
  LocalData,
  MessageEnvelope,
  PayloadOf,
  RequestMessage,
  ResponseFor,
  ResponseMessage,
  UnidirectionalRequestMessage,
} from './types';

const CONNECTION_TIMEOUT = 5_000;
const API_TIMEOUT = 30_000;
const NAVIGATION_TIMEOUT = 5_000;

function timeoutForMessage(message: RequestMessage): number | null {
  const timeout =
    message.type === 'connect'
      ? CONNECTION_TIMEOUT
      : message.type === 'api'
      ? API_TIMEOUT
      : message.type === 'navigateTo'
      ? NAVIGATION_TIMEOUT
      : // Requests not explicitly covered above will not have a timeout. This includes 'fileUpload', which is a user interaction that can take any amount of time.
        null;

  // In tests we have mocked responses which do not require long timeouts
  return timeout !== null && process.env.VITEST ? 40 : timeout;
}

interface BridgeOptions<DATA extends LocalData> {
  onDataUpdate?: (event: DataUpdateMessage<DATA>) => void;
  onBroadcast?: (event: BroadcastMessage) => void;
  onLivereload?: (event: LivereloadMessage) => void;
}

export class Bridge<DATA extends LocalData = LocalData> {
  private onDataUpdate: BridgeOptions<DATA>['onDataUpdate'];
  private onBroadcast: BridgeOptions<DATA>['onBroadcast'];
  private onLivereload: BridgeOptions<DATA>['onLivereload'];
  private pendingMessages = new Map<
    string,
    (result: PayloadOf<ResponseMessage>) => void
  >();

  private targetOrigin = '*';

  constructor({
    onDataUpdate,
    onBroadcast,
    onLivereload,
  }: BridgeOptions<DATA> = {}) {
    this.onDataUpdate = onDataUpdate;
    this.onBroadcast = onBroadcast;
    this.onLivereload = onLivereload;

    window.addEventListener('message', this.handleMessage);
  }

  public destroy() {
    window.removeEventListener('message', this.handleMessage);
  }

  public setOrigin(origin: string) {
    this.targetOrigin = origin;
  }

  sendUnidirectionalMessage(message: UnidirectionalRequestMessage) {
    const messageId = uuidv4();
    const eventData: MessageEnvelope<UnidirectionalRequestMessage> = {
      message,
      meta: {
        messageId,
        version: VERSION,
      },
    };

    window.parent.postMessage(eventData, this.targetOrigin);
  }

  async postMessage<REQ extends RequestMessage>(message: REQ) {
    return new Promise((resolve, reject) => {
      const messageId = uuidv4();

      let timeoutTimer: ReturnType<typeof setTimeout> | undefined;
      const timeoutValue = timeoutForMessage(message);

      if (timeoutValue !== null) {
        timeoutTimer = setTimeout(() => {
          reject(
            new Error(
              `Waiting for response from foundry host for "${message.type}" message (ID: ${messageId}) timed out after ${timeoutValue}ms`,
            ),
          );
        }, timeoutValue);
      }

      this.pendingMessages.set(messageId, (result) => {
        if (timeoutTimer) {
          clearTimeout(timeoutTimer);
        }

        resolve(result);
      });

      const eventData: MessageEnvelope<REQ> = {
        message,
        meta: {
          messageId,
          version: VERSION,
        },
      };

      window.parent.postMessage(eventData, this.targetOrigin);
    }) satisfies Promise<PayloadOf<ResponseFor<REQ, DATA>>>;
  }

  private handleMessage = (
    event: MessageEvent<MessageEnvelope<ResponseMessage<DATA>> | unknown>,
  ) => {
    if (!isValidResponse<DATA>(event)) {
      return;
    }

    const { message } = event.data;

    if (message.type === 'data') {
      this.onDataUpdate?.(message);

      // data update events are unidirectional and originated from the host, so there cannot be a callback waiting for this message
      return;
    }

    if (message.type === 'broadcast') {
      this.onBroadcast?.(message);

      // data update events are unidirectional and are proxied via the host, so there cannot be a callback waiting for this message
      return;
    }

    if (message.type === 'livereload') {
      this.onLivereload?.(message);

      // livereload events are unidirectional and are proxied via the host, so there cannot be a callback waiting for this message
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
