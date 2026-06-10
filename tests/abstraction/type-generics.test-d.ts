import { assertType, describe, test } from 'vitest';
import FalconApi from '../../src/';
import type { ApiResponsePayload } from '../../src/types';

interface User {
  name: string;
  email: string;
}

interface Alert {
  id: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  metadata?: Record<string, string>;
}

interface NestedConfig {
  enabled: boolean;
  rules: {
    name: string;
    conditions: { field: string; operator: string; value: unknown }[];
  }[];
}

declare const api: FalconApi;

describe('Collection generics', () => {
  test('class-level generic types read()', () => {
    const collection = api.collection<User>({ collection: 'users' });

    assertType<Promise<User>>(collection.read('key'));
  });

  test('class-level generic types write()', () => {
    const collection = api.collection<User>({ collection: 'users' });

    assertType<Promise<User>>(
      collection.write('key', { name: 'Dan', email: 'dan@test.com' }),
    );
  });

  test('class-level generic types search()', () => {
    const collection = api.collection<User>({ collection: 'users' });

    assertType<Promise<User[]>>(
      collection.search({ filter: '', offset: '', sort: '', limit: 10 }),
    );
  });

  test('method-level generic overrides class-level', () => {
    const collection = api.collection({ collection: 'users' });

    assertType<Promise<User>>(collection.read<User>('key'));
  });

  test('works with union and optional fields', () => {
    const collection = api.collection<Alert>({ collection: 'alerts' });

    assertType<Promise<Alert>>(collection.read('alert-1'));
    assertType<Promise<Alert[]>>(
      collection.search({ filter: '', offset: '', sort: '', limit: 10 }),
    );
  });

  test('works with deeply nested types', () => {
    const collection = api.collection<NestedConfig>({ collection: 'configs' });

    assertType<Promise<NestedConfig>>(collection.read('config-1'));
  });
});

describe('CloudFunction generics', () => {
  test('get() accepts a response type', () => {
    const fn = api.cloudFunction({ id: 'fn', version: 1 });

    assertType<Promise<User>>(fn.get<User>({ path: '/users/1' }));
  });

  test('post() accepts a response type', () => {
    const fn = api.cloudFunction({ id: 'fn', version: 1 });

    assertType<Promise<User>>(fn.post<User>({ path: '/users', body: {} }));
  });

  test('path().get() accepts a response type', () => {
    const fn = api.cloudFunction({ id: 'fn', version: 1 });
    const endpoint = fn.path('/users');

    assertType<Promise<User>>(endpoint.get<User>());
  });

  test('defaults to unknown without generic', () => {
    const fn = api.cloudFunction({ id: 'fn', version: 1 });

    assertType<Promise<unknown>>(fn.get({ path: '/users' }));
  });

  test('works with nested response types', () => {
    const fn = api.cloudFunction({ id: 'fn', version: 1 });

    assertType<Promise<NestedConfig>>(
      fn.get<NestedConfig>({ path: '/configs/1' }),
    );
  });

  test('different methods can return different types', () => {
    const fn = api.cloudFunction({ id: 'fn', version: 1 });

    assertType<Promise<User>>(fn.get<User>({ path: '/users/1' }));
    assertType<Promise<Alert>>(fn.get<Alert>({ path: '/alerts/1' }));
  });
});

describe('ApiIntegration generics', () => {
  test('execute() accepts a response type', () => {
    const integration = api.apiIntegration({
      definitionId: 'def',
      operationId: 'op',
    });

    assertType<Promise<ApiResponsePayload<User>>>(integration.execute<User>());
  });

  test('defaults to unknown without generic', () => {
    const integration = api.apiIntegration({
      definitionId: 'def',
      operationId: 'op',
    });

    assertType<Promise<ApiResponsePayload<unknown>>>(integration.execute());
  });

  test('works with complex resource types', () => {
    const integration = api.apiIntegration({
      definitionId: 'def',
      operationId: 'op',
    });

    assertType<Promise<ApiResponsePayload<Alert>>>(
      integration.execute<Alert>(),
    );
  });
});

describe('Logscale generics', () => {
  test('query() accepts a response type', () => {
    assertType<Promise<User[]>>(api.logscale.query<User[]>({ id: 'test' }));
  });

  test('savedQuery() accepts a response type', () => {
    assertType<Promise<User[]>>(
      api.logscale.savedQuery<User[]>({ id: 'test' }),
    );
  });

  test('defaults to unknown without generic', () => {
    assertType<Promise<unknown>>(api.logscale.query({ id: 'test' }));
  });

  test('works with complex result types', () => {
    assertType<Promise<Alert[]>>(
      api.logscale.query<Alert[]>({ id: 'alerts-query' }),
    );
  });
});
