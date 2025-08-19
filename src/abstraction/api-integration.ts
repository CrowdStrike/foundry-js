import type FalconApi from '../api';
import type { LocalData } from '../types';

interface ApiIntegrationDefinition {
  definitionId: string;
  operationId: string;
}

interface ExecuteParameters {
  request?: {
    params?: {
      path?: Record<string, unknown>;
      query?: Record<string, unknown>;
      header?: Record<string, unknown>;
    };
    json?: Record<string, unknown> | Record<string, unknown>[];
  };
}

export class ApiIntegration<DATA extends LocalData = LocalData> {
  constructor(
    private readonly falcon: FalconApi<DATA>,
    private readonly definition: ApiIntegrationDefinition,
  ) {}

  public async execute({ request }: ExecuteParameters = {}) {
    return this.falcon.api.plugins.postEntitiesExecuteV1({
      resources: [
        {
          definition_id: this.definition.definitionId,
          operation_id: this.definition.operationId,
          request,
        },
      ],
    });
  }
}
