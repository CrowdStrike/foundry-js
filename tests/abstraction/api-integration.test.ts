import FalconApi from '../../src/';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { connectApi } from '../helpers';
import type { ApiIntegration } from '../../src/abstraction/api-integration';
import type { MessageEnvelope } from '../../src/';
import type { PostEntitiesExecuteV1RequestMessage } from '../../src/apis/plugins';

let api: FalconApi;
let apiIntegration: ApiIntegration;

beforeEach(async () => {
  api = new FalconApi();
  window.parent = new Window();

  await connectApi(api);

  apiIntegration = api.apiIntegration({
    definitionId: 'DefinitionId',
    operationId: 'Operation ID',
  });
});

afterEach(() => api.destroy());

test('it can send request without passed parameters', async () => {
  window.parent.addEventListener(
    'message',
    (
      message: MessageEvent<
        MessageEnvelope<PostEntitiesExecuteV1RequestMessage>
      >,
    ) => {
      const { meta } = message.data;
      const response: MessageEnvelope<unknown> = {
        message: { type: 'api', payload: { testPayload: 123 } },
        meta,
      };

      window.postMessage(response);
    },
    { once: true },
  );

  const executeSpy = vi.spyOn(api.plugins, 'postEntitiesExecuteV1');
  const response = apiIntegration.execute();

  expect(executeSpy).toHaveBeenCalledWith({
    resources: [
      {
        definition_id: 'DefinitionId',
        operation_id: 'Operation ID',
      },
    ],
  });

  await expect(response).resolves.toStrictEqual({ testPayload: 123 });
});

test('it can send request with passed json parameters', async () => {
  window.parent.addEventListener(
    'message',
    (
      message: MessageEvent<
        MessageEnvelope<PostEntitiesExecuteV1RequestMessage>
      >,
    ) => {
      const { meta } = message.data;
      const response: MessageEnvelope<unknown> = {
        message: { type: 'api', payload: { testPayload: 123 } },
        meta,
      };

      window.postMessage(response);
    },
    { once: true },
  );

  const executeSpy = vi.spyOn(api.plugins, 'postEntitiesExecuteV1');
  const response = apiIntegration.execute({
    request: {
      json: { one: { two: 'three' } },
    },
  });

  expect(executeSpy).toHaveBeenCalledWith({
    resources: [
      {
        definition_id: 'DefinitionId',
        operation_id: 'Operation ID',
        request: {
          json: {
            one: { two: 'three' },
          },
        },
      },
    ],
  });

  await expect(response).resolves.toStrictEqual({ testPayload: 123 });
});

test('it can send request with passed params', async () => {
  window.parent.addEventListener(
    'message',
    (
      message: MessageEvent<
        MessageEnvelope<PostEntitiesExecuteV1RequestMessage>
      >,
    ) => {
      const { meta } = message.data;
      const response: MessageEnvelope<unknown> = {
        message: { type: 'api', payload: { testPayload: 123 } },
        meta,
      };

      window.postMessage(response);
    },
    { once: true },
  );

  const executeSpy = vi.spyOn(api.plugins, 'postEntitiesExecuteV1');
  const response = apiIntegration.execute({
    request: {
      params: {
        path: { test: 'one' },
        query: {
          foo: 'bar',
        },
        header: {
          header1: 'bar1',
        },
      },
    },
  });

  expect(executeSpy).toHaveBeenCalledWith({
    resources: [
      {
        definition_id: 'DefinitionId',
        operation_id: 'Operation ID',
        request: {
          params: {
            path: { test: 'one' },
            query: {
              foo: 'bar',
            },
            header: {
              header1: 'bar1',
            },
          },
        },
      },
    ],
  });

  await expect(response).resolves.toStrictEqual({ testPayload: 123 });
});
