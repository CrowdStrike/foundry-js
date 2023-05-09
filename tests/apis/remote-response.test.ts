import { expect, vi, test, beforeEach, afterEach } from 'vitest';
import FalconApi from '../../src';
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
  api.remoteResponse.getScriptIds();

  expect(spy).toHaveBeenCalledOnce();
  expect(spy.mock.lastCall?.[0]).toEqual(
    expect.objectContaining({
      payload: { name: 'getQueriesScriptsV1', params: {} },
      meta: {
        type: 'remoteResponse',
        version: 'current',
        __csMessageId__: expect.stringMatching(uuidV4Regex),
      },
    })
  );
});

test('it can call getIncidentEntities', async () => {
  const spy = vi.spyOn(window.parent, 'postMessage');
  api.remoteResponse.getScriptEntities({});

  expect(spy).toHaveBeenCalledOnce();
  expect(spy.mock.lastCall?.[0]).toEqual(
    expect.objectContaining({
      payload: { name: 'postEntitiesScriptsGetV2', body: {}, params: {} },
      meta: {
        type: 'remoteResponse',
        version: 'current',
        __csMessageId__: expect.stringMatching(uuidV4Regex),
      },
    })
  );
});
