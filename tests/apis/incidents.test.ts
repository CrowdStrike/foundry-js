import { expect, vi, test, beforeEach, afterEach } from 'vitest';
import FalconApi from '../../src/';
import { connectApi, uuidV4Regex } from '../helpers';

let api: FalconApi;

beforeEach(async () => {
  api = new FalconApi();
  window.parent = new Window();

  await connectApi(api);
});

afterEach(() => api.destroy());

test('it can call getIncidentIds', async () => {
  const spy = vi.spyOn(window.parent, 'postMessage');
  api.incidents.getIncidentIds();

  expect(spy).toHaveBeenCalledOnce();
  expect(spy.mock.lastCall?.[0]).toEqual(
    expect.objectContaining({
      payload: { name: 'getQueriesIncidentsV1', params: {} },
      meta: {
        type: 'incidents',
        version: 'current',
        __csMessageId__: expect.stringMatching(uuidV4Regex),
      },
    })
  );
});

test('it can call getIncidentEntities', async () => {
  const spy = vi.spyOn(window.parent, 'postMessage');
  api.incidents.getIncidentEntities({});

  expect(spy).toHaveBeenCalledOnce();
  expect(spy.mock.lastCall?.[0]).toEqual(
    expect.objectContaining({
      payload: { name: 'postEntitiesIncidentsGetV1', body: {}, params: {} },
      meta: {
        type: 'incidents',
        version: 'current',
        __csMessageId__: expect.stringMatching(uuidV4Regex),
      },
    })
  );
});
