import type FalconApi from '../api';
import type { LocalData } from '../types';
interface ApiIntegrationDefinition {
    definitionId: string;
    operationId: string;
}
interface ExecuteParameters {
    request?: {
        params?: {
            path?: Record<any, unknown>;
            query?: Record<any, unknown>;
            header?: Record<any, unknown>;
        };
        json?: Record<any, unknown> | Record<any, unknown>[];
    };
}
export declare class ApiIntegration<DATA extends LocalData = LocalData> {
    private readonly falcon;
    private readonly definition;
    constructor(falcon: FalconApi<DATA>, definition: ApiIntegrationDefinition);
    execute({ request }?: ExecuteParameters): Promise<import("../apis/plugins").PostEntitiesExecuteV1ApiResponse>;
}
export {};
