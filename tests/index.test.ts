import { expect, test, vi, beforeEach, afterEach } from 'vitest';
import FalconApi from '../src/';
import { Bridge } from '../src/bridge';
import { PLATFORM_EVENTS } from '../src/apis/types';

let api: FalconApi;

beforeEach(() => {
  api = new FalconApi();
  window.parent = new Window();
});

afterEach(() => api.destroy());

test('it can be instantiated', () => {
  expect(api).toBeDefined();
});

test('it has a bridge', () => {
  expect(api.bridge).toBeInstanceOf(Bridge);
});

test('it can connect to main thread', async () => {
  expect(api.isConnected).toEqual(false);
  const promise = api.connect();

  // simulate ready event coming from main thread
  window.postMessage({ payload: { name: PLATFORM_EVENTS.READY } });

  await promise;
  expect(api.isConnected).toEqual(true);
});

test('failed connect attempt will time out', async () => {
  await expect(api.connect()).rejects.toThrow();
});
