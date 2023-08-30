import FalconApi from '../src';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { connectApi } from './helpers';
import { pEvent } from 'p-event';
import { v4 as uuidv4 } from 'uuid';
import type { DataUpdateMessage, LocalData, MessageEnvelope } from '../src';

let api: FalconApi;

beforeEach(async () => {
  api = new FalconApi();
  window.parent = new Window();
});

afterEach(() => api.destroy());

test('it receives initial data', async () => {
  const data: LocalData = {
    theme: 'theme-light',
    cid: 'xxx',
    locale: 'en-us',
    foo: 'bar',
  };

  await connectApi(api, data);

  expect(api.data, 'initial data is exposed synchronously on .data').toEqual(
    data,
  );
});

test('data can update', async () => {
  await connectApi(api);

  expect(api.data).toBeUndefined();

  const dataUpdate: MessageEnvelope<DataUpdateMessage> = {
    message: {
      type: 'data',
      payload: {
        theme: 'theme-light',
        cid: 'xxx',
        locale: 'en-us',
        some: 'stuff',
      },
    },
    meta: {
      messageId: uuidv4(),
    },
  };

  window.postMessage(dataUpdate);

  expect(api.data, 'new data is updated on .data').toEqual({
    theme: 'theme-light',
    cid: 'xxx',
    locale: 'en-us',
    some: 'stuff',
  });
});

test('it can subscribe to data updates', async () => {
  await connectApi(api);

  let data: LocalData | undefined;

  api.events.on('data', (eventData) => {
    data = eventData;
  });

  const dataUpdate: MessageEnvelope<DataUpdateMessage> = {
    message: {
      type: 'data',
      payload: {
        theme: 'theme-light',
        cid: 'xxx',
        locale: 'en-us',
        some: 'stuff',
      },
    },
    meta: {
      messageId: uuidv4(),
    },
  };

  // await for the async data update event to have been triggered
  const promise = pEvent<'data', unknown>(api.events, 'data');

  window.postMessage(dataUpdate);
  await promise;

  expect(data, 'new data is provided with the data event').toEqual({
    theme: 'theme-light',
    cid: 'xxx',
    locale: 'en-us',
    some: 'stuff',
  });
  expect(api.data, 'new data is updated on .data').toEqual({
    theme: 'theme-light',
    cid: 'xxx',
    locale: 'en-us',
    some: 'stuff',
  });
});
