import { Bridge } from '../src/bridge';
import { Window } from 'happy-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { nextTick, uuidV4Regex } from './helpers';

import type { MessageEnvelope } from '../src/types';

let bridge: Bridge;

beforeEach(() => {
  bridge = new Bridge();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-next-line
  window.parent = new Window();
});

afterEach(() => {
  bridge.destroy();
  vi.restoreAllMocks();
});

test('it can be instantiated', () => {
  expect(bridge).toBeDefined();
});

test('it throws when receiving an unexpected message', async () => {
  const invalidMessage: MessageEnvelope<unknown> = {
    meta: { messageId: 'foo', version: 'current' },
    message: {},
  };

  const errorSpy = vi.spyOn(bridge, 'throwError');

  errorSpy.mockImplementationOnce(() => true);

  window.postMessage(invalidMessage);
  await nextTick();

  expect(errorSpy).toHaveBeenCalledTimes(1);
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
    }),
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
    },
  );

  const promise = expect(bridge.postMessage(request)).resolves.toEqual({
    status: 'ok',
  });

  // make sure we have no false positives
  await promise;
});
