import FalconApi from '../src';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { connectApi, uuidV4Regex } from './helpers';
import { pEvent } from 'p-event';
import { v4 as uuidv4 } from 'uuid';
import type { BroadcastMessage, MessageEnvelope } from '../src';

let api: FalconApi;

beforeEach(async () => {
  api = new FalconApi();
  window.parent = new Window();
});

afterEach(() => api.destroy());

test('it can send a broadcast event', async () => {
  const spy = vi.spyOn(window.parent, 'postMessage');
  const customPayload = {
    foo: 'bar',
  };

  await connectApi(api);
  api.sendBroadcast(customPayload);

  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy.mock.lastCall?.[0]).toEqual(
    expect.objectContaining({
      message: {
        type: 'broadcast',
        payload: customPayload,
      },
      meta: {
        version: 'current',
        messageId: expect.stringMatching(uuidV4Regex),
      },
    }),
  );
});

test('it can receive broadcast events', async () => {
  await connectApi(api);

  const sentData = { foo: 'bar' };
  let receivedData: unknown;

  api.events.on('broadcast', (eventData) => {
    receivedData = eventData;
  });

  const dataUpdate: MessageEnvelope<BroadcastMessage<typeof sentData>> = {
    message: {
      type: 'broadcast',
      payload: sentData,
    },
    meta: {
      messageId: uuidv4(),
    },
  };

  // await for the async data update event to have been triggered
  const promise = pEvent<'broadcast', unknown>(api.events, 'broadcast');

  window.postMessage(dataUpdate);
  await promise;

  expect(receivedData, 'new data is provided with the data event').toEqual(
    sentData,
  );
});
