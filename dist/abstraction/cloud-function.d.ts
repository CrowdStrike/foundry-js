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
        get: (params?: GetParameters["params"]) => Promise<unknown>;
        post: (body: PostParameters["body"], params?: PostParameters["params"]) => Promise<unknown>;
        patch: (body: PatchParameters["body"], params?: PostParameters["params"]) => Promise<unknown>;
        put: (body: PutParameters["body"], params?: PostParameters["params"]) => Promise<unknown>;
        delete: (body: DeleteParameters["body"], params?: PostParameters["params"]) => Promise<unknown>;
    };
    get({ path, params }: GetParameters): Promise<unknown>;
    post({ path, params, body }: PostParameters): Promise<unknown>;
    patch({ path, params, body }: PatchParameters): Promise<unknown>;
    put({ path, params, body }: PutParameters): Promise<unknown>;
    delete({ path, params, body }: DeleteParameters): Promise<unknown>;
    destroy(): void;
}
export {};
