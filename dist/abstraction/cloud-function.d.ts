import type FalconApi from '../api';
import type { CloudFunctionDefinition, LocalData } from '../types';
interface Params {
    header?: Record<string, string[]>;
    query?: Record<string, string[]>;
    [key: string]: unknown;
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
export declare class CloudFunction<DATA extends LocalData = LocalData> {
    private readonly falcon;
    private readonly definition;
    private static GET;
    private static POST;
    private static PATCH;
    private static PUT;
    private static DELETE;
    /**
     * @internal
     */
    pollTimeout: number;
    /**
     * @internal
     */
    intervalId?: number;
    /**
     * @internal
     */
    constructor(falcon: FalconApi<DATA>, definition: CloudFunctionDefinition);
    private execute;
    private getExecutionResult;
    private pollForResult;
    path(pathEntry: string): {
        path: string;
        queryParams: Record<string, string[]> | undefined;
        get: <T = unknown>(params?: GetParameters["params"]) => Promise<T>;
        post: <T = unknown>(body: PostParameters["body"], params?: PostParameters["params"]) => Promise<T>;
        patch: <T = unknown>(body: PatchParameters["body"], params?: PostParameters["params"]) => Promise<T>;
        put: <T = unknown>(body: PutParameters["body"], params?: PostParameters["params"]) => Promise<T>;
        delete: <T = unknown>(body: DeleteParameters["body"], params?: PostParameters["params"]) => Promise<T>;
    };
    get<T = unknown>({ path, params }: GetParameters): Promise<T>;
    post<T = unknown>({ path, params, body }: PostParameters): Promise<T>;
    patch<T = unknown>({ path, params, body }: PatchParameters): Promise<T>;
    put<T = unknown>({ path, params, body }: PutParameters): Promise<T>;
    delete<T = unknown>({ path, params, body }: DeleteParameters): Promise<T>;
    destroy(): void;
}
export {};
