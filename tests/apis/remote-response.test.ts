import FalconApi from '../../src';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { connectApi, uuidV4Regex } from '../helpers';

let api: FalconApi;

beforeEach(async () => {
  api = new FalconApi();
  window.parent = new Window();

  await connectApi(api);
});

afterEach(() => api.destroy());

test('it can call getScriptIds', async () => {
  const spy = vi.spyOn(window.parent, 'postMessage');

  api.remoteResponse.getEntitiesAppCommandV1({
    cloudRequestId: '123',
    sequenceId: '456',
  });

  expect(spy).toHaveBeenCalledOnce();
  expect(spy.mock.lastCall?.[0]).toEqual(
    expect.objectContaining({
      message: {
        type: 'api',
        api: 'remoteResponse',
        method: 'getEntitiesAppCommandV1',
        payload: {
          params: {
            cloudRequestId: '123',
            sequenceId: '456',
          },
        },
      },
      meta: {
        version: 'current',
        messageId: expect.stringMatching(uuidV4Regex),
      },
    }),
  );
});
