import FalconApi from '../src';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { connectApi, nextTick } from './helpers';
import { v4 as uuidv4 } from 'uuid';
import type { DataUpdateMessage, LocalData, MessageEnvelope } from '../src';

let api: FalconApi;

beforeEach(async () => {
  api = new FalconApi();
  window.parent = new Window();
});

afterEach(() => api.destroy());

test('it receives initial theme', async () => {
  const data: LocalData = {
    app: {
      id: 'testid',
    },
    user: {
      uuid: '123',
      username: 'johndoe',
    },
    theme: 'theme-light',
    cid: 'xxx',
    locale: 'en-us',
  };

  await connectApi(api, data);

  expect(
    document.documentElement.classList.contains('theme-light'),
    'It sets the theme as a class on html tag',
  ).toEqual(true);
});

test('theme can update', async () => {
  await connectApi(api);

  const handleMessageSpy = vi.spyOn(api.bridge, 'handleMessage');

  expect(handleMessageSpy).toHaveBeenCalledTimes(0);

  expect(api.data).toBeUndefined();

  const dataUpdate: MessageEnvelope<DataUpdateMessage> = {
    message: {
      type: 'data',
      payload: {
        app: {
          id: 'testid',
        },
        user: {
          uuid: '123',
          username: 'johndoe',
        },
        theme: 'theme-dark',
        cid: 'xxx',
        locale: 'en-us',
      },
    },
    meta: {
      messageId: uuidv4(),
    },
  };

  window.postMessage(dataUpdate);

  await nextTick();

  expect(handleMessageSpy).toHaveBeenCalledTimes(1);

  expect(
    document.documentElement.classList.contains('theme-dark'),
    'It sets the theme as a class on html tag',
  ).toEqual(true);
});
