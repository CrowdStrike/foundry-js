import { afterEach, beforeEach, expect, test } from 'vitest';
import FalconApi from '../src';

import type {
  ConnectRequestMessage,
  ConnectResponseMessage,
  MessageEnvelope,
} from '../src/types';

let api: FalconApi;

beforeEach(() => {
  api = new FalconApi();
  window.parent = new Window();
});

afterEach(() => api.destroy());

test('it can connect to main thread', async () => {
  // simulate ready answer coming back from main thread
  window.parent.addEventListener(
    'message',
    (message: MessageEvent<MessageEnvelope<ConnectRequestMessage>>) => {
      const response: MessageEnvelope<ConnectResponseMessage> = {
        message: {
          type: 'connect',
          payload: {
            origin: 'www.example.com',
          },
        },
        meta: {
          messageId: message.data.meta.messageId,
          version: 'current',
        },
      };
      window.postMessage(response);
    }
  );

  expect(api.isConnected).toEqual(false);

  const promise = api.connect();

  await promise;
  expect(api.isConnected).toEqual(true);
});

test('failed connect attempt will time out', async () => {
  await expect(api.connect()).rejects.toThrow();
});
