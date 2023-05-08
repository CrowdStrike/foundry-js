import { expect, test, vi, beforeEach, afterEach } from 'vitest';
import { Bridge, ReceivedMessage } from '../src/bridge';

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
  const invalidMessage: ReceivedMessage = {
    meta: { __csMessageId__: 'foo' },
    payload: {},
  };
  expect(() => window.postMessage(invalidMessage)).toThrow();
});

test('it can send a message', () => {
  const spy = vi.spyOn(window.parent, 'postMessage');

  bridge.postMessage({ foo: 'bar' }, { type: 'bridge' });

  expect(spy).toHaveBeenCalledOnce();
  expect(spy.mock.lastCall?.[0]).toEqual(
    expect.objectContaining({
      payload: { foo: 'bar' },
    })
  );
});

test('it resolves with the response', async () => {
  const spy = vi.spyOn(window.parent, 'postMessage');

  window.parent.addEventListener('message', (message) => {
    window.postMessage({
      payload: { ...message.data.payload, status: 'ok' },
      meta: { __csMessageId__: message.data.meta.__csMessageId__ },
    });
  });

  const promise = expect(
    bridge.postMessage({ foo: 'bar' }, { type: 'bridge' })
  ).resolves.toEqual({ foo: 'bar', status: 'ok' });

  // make sure we have no false positives
  await promise;
});
