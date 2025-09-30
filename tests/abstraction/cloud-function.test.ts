import FalconApi from '../../src/';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { connectApi } from '../helpers';
import type { CloudFunction } from '../../src/abstraction/cloud-function';

let api: FalconApi;
let cloudFunction: CloudFunction;

beforeEach(async () => {
  api = new FalconApi();
  window.parent = new Window();

  await connectApi(api);

  cloudFunction = api.cloudFunction({ id: 'test-id', version: 1 });
  cloudFunction.pollTimeout = 1;
});

afterEach(() => api.destroy());

test('it can accept path with /', async () => {
  const cloudFunctionInstance = cloudFunction.path('/testing');

  expect(cloudFunctionInstance.path).toBe('/testing');
});

test('it can accept path without /', async () => {
  const cloudFunctionInstance = cloudFunction.path('testing');

  expect(cloudFunctionInstance.path).toBe('/testing');
});

test('it can accept path with query params', async () => {
  const cloudFunctionInstance = cloudFunction.path(
    '/testing?param1=value1&param2=value2',
  );

  expect(cloudFunctionInstance.path).toBe('/testing');
  expect(cloudFunctionInstance.queryParams).toMatchObject({
    param1: ['value1'],
    param2: ['value2'],
  });
});

test('it can send request and wait for response', async () => {
  const cloudFunctionInstance = cloudFunction.path('testing');

  const executionSpy = vi.spyOn(api.api.faasGateway, 'postEntitiesExecutionV1');
  const executionResultSpy = vi.spyOn(
    api.api.faasGateway,
    'getEntitiesExecutionV1',
  );

  executionSpy.mockResolvedValueOnce({
    resources: [{ execution_id: 'test-1' }],
    errors: [],
  });

  executionResultSpy.mockResolvedValueOnce({
    resources: [],
    errors: [],
  });

  executionResultSpy.mockResolvedValueOnce({
    resources: [{ payload: { data: 'ok' } }],
    errors: [],
  });

  const response = await cloudFunctionInstance.get();

  expect(response).toStrictEqual({ data: 'ok' });
  expect(executionSpy).toHaveBeenCalledOnce();
  expect(executionResultSpy).toHaveBeenCalledTimes(2);
});

test('it can handle execution result failure', async () => {
  const cloudFunctionInstance = cloudFunction.path('testing');

  const executionSpy = vi.spyOn(api.api.faasGateway, 'postEntitiesExecutionV1');
  const executionResultSpy = vi.spyOn(
    api.api.faasGateway,
    'getEntitiesExecutionV1',
  );

  executionSpy.mockResolvedValueOnce({
    resources: [{ execution_id: 'test-1' }],
    errors: [],
  });

  executionResultSpy.mockRejectedValueOnce({
    resources: [],
    errors: [],
  });

  executionResultSpy.mockResolvedValueOnce({
    resources: [{ payload: { data: 'ok' } }],
    errors: [],
  });

  const response = await cloudFunctionInstance.get();

  expect(response).toStrictEqual({ data: 'ok' });
  expect(executionSpy).toHaveBeenCalledOnce();
  expect(executionResultSpy).toHaveBeenCalledTimes(2);
});

test('it stops after 3 failed retries for execution result', async () => {
  const cloudFunctionInstance = cloudFunction.path('testing');

  const executionSpy = vi.spyOn(api.api.faasGateway, 'postEntitiesExecutionV1');
  const executionResultSpy = vi.spyOn(
    api.api.faasGateway,
    'getEntitiesExecutionV1',
  );

  executionSpy.mockResolvedValueOnce({
    resources: [{ execution_id: 'test-1' }],
    errors: [],
  });

  executionResultSpy.mockRejectedValueOnce({ errors: [{ code: 500 }] });
  executionResultSpy.mockRejectedValueOnce({ errors: [{ code: 501 }] });
  executionResultSpy.mockRejectedValueOnce({ errors: [{ code: 502 }] });

  await expect(() => cloudFunctionInstance.get()).rejects.toThrowError();

  expect(executionSpy).toHaveBeenCalledOnce();
  expect(executionResultSpy).toHaveBeenCalledTimes(3);
});

test('it clears interval on destroy', async () => {
  cloudFunction.intervalId = 111;

  const destroySpy = vi.spyOn(cloudFunction, 'destroy');

  api.destroy();

  expect(destroySpy).toHaveBeenCalledOnce();
  expect(cloudFunction.intervalId).toBe(undefined);
});

test('it clears multiple intervals on destroy', async () => {
  const cloudFunction2 = api.cloudFunction({ id: 'test-id', version: 1 });

  cloudFunction2.intervalId = 222;
  cloudFunction.intervalId = 111;

  const destroySpy = vi.spyOn(cloudFunction, 'destroy');
  const destroy2Spy = vi.spyOn(cloudFunction2, 'destroy');

  api.destroy();

  expect(destroySpy).toHaveBeenCalledOnce();
  expect(destroy2Spy).toHaveBeenCalledOnce();
  expect(cloudFunction.intervalId).toBe(undefined);
  expect(cloudFunction2.intervalId).toBe(undefined);
});
