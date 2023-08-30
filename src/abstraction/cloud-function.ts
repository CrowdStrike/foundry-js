import type FalconApi from '../api';
import type { LocalData } from '../types';

interface FunctionDefinition {
  id: string;
  version: number;
}

interface ExecuteParameters {
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  queryParams?: Record<string, unknown>;
  headers?: Record<string, unknown>;
}

interface PostParameters {
  path: string;
  body?: Record<string, unknown>;
  queryParams?: Record<string, unknown>;
  headers?: Record<string, unknown>;
}

type PatchParameters = PostParameters;

type PutParameters = PostParameters;

type DeleteParameters = PostParameters;

interface GetParameters {
  path: string;
  queryParams?: Record<string, unknown>;
  headers?: Record<string, unknown>;
}

export class CloudFunction<DATA extends LocalData = LocalData> {
  static GET = 'GET' as const;
  static POST = 'POST' as const;
  static PATCH = 'PATCH' as const;
  static PUT = 'PUT' as const;
  static DELETE = 'DELETE' as const;

  pollTimeout = 500;
  intervalId?: number;

  constructor(
    private readonly falcon: FalconApi<DATA>,
    private readonly definition: FunctionDefinition,
  ) {}

  private async execute({
    path,
    method,
    queryParams,
    body,
    headers,
  }: ExecuteParameters) {
    const result = await this.falcon.faasGateway.postEntitiesExecutionV1({
      function_id: this.definition.id,
      function_version: this.definition.version,
      payload: {
        path,
        method,
        body,
        headers,
        query_params: queryParams,
      },
    });

    return new Promise((resolve, reject) => {
      const execution = result?.resources?.[0] as any;

      if (!execution?.execution_id) {
        reject(result?.errors);
      } else {
        this.pollForResult({
          resolve,
          reject,
          executionId: execution?.execution_id,
        });
      }
    });
  }

  private async getExecutionResult(
    executionId: string,
  ): Promise<Record<string, unknown> | undefined> {
    const resultResponse = await this.falcon.faasGateway.getEntitiesExecutionV1(
      {
        id: executionId,
      },
    );

    const executionResult = resultResponse?.resources?.[0] as any;

    return executionResult?.payload;
  }

  private pollForResult({
    resolve,
    reject,
    executionId,
  }: {
    resolve: (value: unknown) => void;
    reject: (value?: unknown) => void;
    executionId: string;
  }) {
    let exceptionRetries = 2;

    this.intervalId = window.setInterval(async () => {
      try {
        const payload = await this.getExecutionResult(executionId);

        if (payload) {
          window.clearInterval(this.intervalId);
          resolve(payload);
        }
      } catch (e) {
        if (exceptionRetries <= 0) {
          window.clearInterval(this.intervalId);
          reject(e);
        }

        exceptionRetries--;
      }
    }, this.pollTimeout);
  }

  public path(pathEntry: string) {
    const urlPath = new URL(pathEntry, 'http://localhost');

    const path = urlPath.pathname;
    const searchParams = [...urlPath.searchParams.entries()].map(
      ([key, value]) => ({
        [key]: [value],
      }),
    );

    return {
      path,
      queryParams: searchParams,

      get: async (queryParams: GetParameters['queryParams'] = {}) => {
        return this.get({
          path,
          queryParams: queryParams ?? searchParams ?? {},
        });
      },

      post: async (
        body: PostParameters['body'],
        queryParams: PostParameters['queryParams'] = {},
        headers: PostParameters['headers'] = {},
      ) => {
        return this.post({
          path,
          queryParams: queryParams ?? searchParams ?? {},
          body,
          headers,
        });
      },

      patch: async (
        body: PatchParameters['body'],
        queryParams: PatchParameters['queryParams'] = {},
        headers: PatchParameters['headers'] = {},
      ) => {
        return this.patch({
          path,
          queryParams: queryParams ?? searchParams ?? {},
          body,
          headers,
        });
      },

      put: async (
        body: PutParameters['body'],
        queryParams: PutParameters['queryParams'] = {},
        headers: PutParameters['headers'] = {},
      ) => {
        return this.put({
          path,
          queryParams: queryParams ?? searchParams ?? {},
          body,
          headers,
        });
      },

      delete: async (
        body: DeleteParameters['body'],
        queryParams: DeleteParameters['queryParams'] = {},
        headers: DeleteParameters['headers'] = {},
      ) => {
        return this.delete({
          path,
          queryParams: queryParams ?? searchParams ?? {},
          body,
          headers,
        });
      },
    };
  }

  public async get({ path, queryParams, headers }: GetParameters) {
    return this.execute({
      path,
      method: CloudFunction.GET,
      queryParams,
      headers,
    });
  }

  public async post({ path, queryParams, body, headers }: PostParameters) {
    return this.execute({
      path,
      method: CloudFunction.POST,
      body,
      queryParams,
      headers,
    });
  }

  public async patch({ path, queryParams, body, headers }: PatchParameters) {
    return this.execute({
      path,
      method: CloudFunction.PATCH,
      body,
      queryParams,
      headers,
    });
  }

  public async put({ path, queryParams, body, headers }: PutParameters) {
    return this.execute({
      path,
      method: CloudFunction.PUT,
      body,
      queryParams,
      headers,
    });
  }

  public async delete({ path, queryParams, body, headers }: DeleteParameters) {
    return this.execute({
      path,
      method: CloudFunction.DELETE,
      body,
      queryParams,
      headers,
    });
  }

  public destroy() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}
