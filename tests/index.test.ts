import { afterEach, beforeEach, expect, test } from 'vitest';
import FalconApi from '../src/';
import { Bridge } from '../src/bridge';

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
