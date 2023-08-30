import FalconApi from '../src';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { uuidV4Regex } from './helpers';
import type {
  MessageEnvelope,
  OpenModalRequestMessage,
  OpenModalResponseMessage,
} from '../src';

let api: FalconApi;

beforeEach(async () => {
  api = new FalconApi();
  window.parent = new Window();
});

afterEach(() => api.destroy());

describe('openModal', () => {
  test('it can request to open a modal', async () => {
    const spy = vi.spyOn(window.parent, 'postMessage');

    api.ui.openModal({ id: '123', type: 'extension' }, 'Modal title', {
      path: '/foo',
      data: { foo: 'bar' },
      size: 'lg',
      align: 'top',
    });

    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.lastCall?.[0]).toEqual(
      expect.objectContaining({
        message: {
          type: 'openModal',
          payload: {
            extension: {
              id: '123',
              type: 'extension',
            },
            options: {
              path: '/foo',
              data: { foo: 'bar' },
              size: 'lg',
              align: 'top',
            },
            title: 'Modal title',
          },
        },
        meta: {
          version: 'current',
          messageId: expect.stringMatching(uuidV4Regex),
        },
      }),
    );
  });

  test('it resolves with response payload', async () => {
    // simulate ready answer coming back from main thread
    window.parent.addEventListener(
      'message',
      (message: MessageEvent<MessageEnvelope<OpenModalRequestMessage>>) => {
        const response: MessageEnvelope<OpenModalResponseMessage> = {
          message: {
            type: 'openModal',
            payload: {
              foo: 'bar',
            },
          },
          meta: {
            messageId: message.data.meta.messageId,
            version: 'current',
          },
        };

        window.postMessage(response);
      },
    );

    const result = await api.ui.openModal(
      { id: '123', type: 'extension' },
      'Modal title',
    );

    expect(result).toStrictEqual({ foo: 'bar' });
  });

  test('it can request to close a modal', async () => {
    const spy = vi.spyOn(window.parent, 'postMessage');

    api.ui.closeModal({ foo: 'bar' });

    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.lastCall?.[0]).toEqual(
      expect.objectContaining({
        message: {
          type: 'closeModal',
          payload: {
            foo: 'bar',
          },
        },
        meta: {
          version: 'current',
          messageId: expect.stringMatching(uuidV4Regex),
        },
      }),
    );
  });

  test('it will not time out', async () => {
    // we intentionally do not create a response message, and so we also do not await this call, as this promise will never resolve or reject
    api.ui.openModal({ id: '123', type: 'extension' }, 'Modal title');

    // any other request would have timed out at this point...
    await new Promise((r) => setTimeout(r, 50));
  });
});
