import type FalconApi from '../api';
import type { CloudFunctionDefinition, LocalData } from '../types';

interface Params {
  header?: Record<string, string[]>;
  query?: Record<string, string[]>;
}

interface ExecuteParameters {
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  params?: Params;
}

interface PostParameters {
  path: string;
  body?: Record<string, unknown>;
  params?: Params;
}

type PatchParameters = PostParameters;

type PutParameters = PostParameters;

type DeleteParameters = PostParameters;

interface GetParameters {
  path: string;
  params?: Params;
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
    private readonly definition: CloudFunctionDefinition,
  ) {}

  private async execute({
    path,
    method,
    body,
    params,
  }: ExecuteParameters) {
    let functionDefinition = 'id' in this.definition ? {
      function_id: this.definition.id,
      function_version: this.definition.version,
    } : {
      function_name: this.definition.name,
      function_version: this.definition.version,
    };

    const result = await this.falcon.faasGateway.postEntitiesExecutionV1({
      ...functionDefinition,
      payload: {
        path,
        method,
        body,
        params,
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
    const searchParams = [...urlPath.searchParams.entries()].reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: [value],
      })
    , {} as Params['query']);

    return {
      path,
      queryParams: searchParams,

      get: async (params: GetParameters['params'] = {}) => {
        return this.get({
          path,
          params: {
            query: params?.query ?? searchParams ?? {},
            header: params?.header ?? {},
          },
        });
      },

      post: async (
        body: PostParameters['body'],
        params: PostParameters['params'] = {},
      ) => {
        return this.post({
          path,
          params: {
            query: params?.query ?? searchParams ?? {},
            header: params?.header ?? {},
          },
          body,
        });
      },

      patch: async (
        body: PatchParameters['body'],
        params: PostParameters['params'] = {},
      ) => {
        return this.patch({
          path,
          params: {
            query: params?.query ?? searchParams ?? {},
            header: params?.header ?? {},
          },
          body,
        });
      },

      put: async (
        body: PutParameters['body'],
        params: PostParameters['params'] = {},
      ) => {
        return this.put({
          path,
          params: {
            query: params?.query ?? searchParams ?? {},
            header: params?.header ?? {},
          },
          body,
        });
      },

      delete: async (
        body: DeleteParameters['body'],
        params: PostParameters['params'] = {},
      ) => {
        return this.delete({
          path,
          params: {
            query: params?.query ?? searchParams ?? {},
            header: params?.header ?? {},
          },
          body,
        });
      },
    };
  }

  public async get({ path, params }: GetParameters) {
    return this.execute({
      path,
      method: CloudFunction.GET,
      params,
    });
  }

  public async post({ path, params, body }: PostParameters) {
    return this.execute({
      path,
      method: CloudFunction.POST,
      body,
      params,
    });
  }

  public async patch({ path, params, body }: PatchParameters) {
    return this.execute({
      path,
      method: CloudFunction.PATCH,
      body,
      params,
    });
  }

  public async put({ path, params, body }: PutParameters) {
    return this.execute({
      path,
      method: CloudFunction.PUT,
      body,
      params,
    });
  }

  public async delete({ path, params, body }: DeleteParameters) {
    return this.execute({
      path,
      method: CloudFunction.DELETE,
      body,
      params,
    });
  }

  public destroy() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}
