import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { Bridge } from '../src/bridge';
import { uuidV4Regex } from './helpers';

import type { MessageEnvelope } from '../src/types';

let bridge: Bridge;

beforeEach(() => {
  bridge = new Bridge();
  window.parent = new Window();
});

afterEach(() => bridge.destroy());

test('it can be instantiated', () => {
  expect(bridge).toBeDefined();
});

test('it throws when receiving an unexpected message', () => {
  const invalidMessage: MessageEnvelope<unknown> = {
    meta: { messageId: 'foo', version: 'current' },
    message: {},
  };
  expect(() => window.postMessage(invalidMessage)).toThrow();
});

test('it can send a message', () => {
  const spy = vi.spyOn(window.parent, 'postMessage');

  bridge.postMessage({ type: 'connect' });

  expect(spy).toHaveBeenCalledOnce();
  expect(spy.mock.lastCall?.[0]).toEqual(
    expect.objectContaining({
      message: { type: 'connect' },
      meta: {
        version: 'current',
        messageId: expect.stringMatching(uuidV4Regex),
      },
    })
  );
});

test('it resolves with the response payload', async () => {
  const request = { type: 'connect' } as const;

  window.parent.addEventListener(
    'message',
    (message: MessageEvent<MessageEnvelope<typeof request>>) => {
      window.postMessage({
        message: { ...message.data.message, payload: { status: 'ok' } },
        meta: { messageId: message.data.meta.messageId },
      });
    }
  );

  const promise = expect(bridge.postMessage(request)).resolves.toEqual({
    status: 'ok',
  });

  // make sure we have no false positives
  await promise;
});
