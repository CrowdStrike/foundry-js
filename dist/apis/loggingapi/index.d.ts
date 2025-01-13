/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
import type { Bridge } from '../../bridge';
import type { ApiResponsePayload, BaseApiRequestMessage, BaseApiResponseMessage, BaseUrlParams, QueryParam } from '../../types';
export type LoggingapiRequestApi = 'loggingapi';
export type CommonApiResponseMessage = BaseApiResponseMessage<ApiResponsePayload>;
export interface CommonApiRequestMessage extends BaseApiRequestMessage<BaseUrlParams, unknown> {
    api: LoggingapiRequestApi;
}
export interface GetEntitiesSavedSearchesExecuteV1QueryParams extends BaseUrlParams {
    version?: QueryParam;
    jobId: QueryParam;
    detailed?: QueryParam;
    metadata?: QueryParam;
    offset?: QueryParam;
    limit?: QueryParam;
}
export type GetEntitiesSavedSearchesExecuteV1ApiResponse = ApiResponsePayload;
export type GetEntitiesSavedSearchesExecuteV1ResponseMessage = BaseApiResponseMessage<GetEntitiesSavedSearchesExecuteV1ApiResponse>;
export interface GetEntitiesSavedSearchesExecuteV1RequestMessage extends BaseApiRequestMessage<GetEntitiesSavedSearchesExecuteV1QueryParams> {
    api: LoggingapiRequestApi;
    method: 'getEntitiesSavedSearchesExecuteV1';
}
export interface GetEntitiesSavedSearchesV1QueryParams extends BaseUrlParams {
    ids: QueryParam;
}
export type GetEntitiesSavedSearchesV1ApiResponse = ApiResponsePayload;
export type GetEntitiesSavedSearchesV1ResponseMessage = BaseApiResponseMessage<GetEntitiesSavedSearchesV1ApiResponse>;
export interface GetEntitiesSavedSearchesV1RequestMessage extends BaseApiRequestMessage<GetEntitiesSavedSearchesV1QueryParams> {
    api: LoggingapiRequestApi;
    method: 'getEntitiesSavedSearchesV1';
}
export interface PostEntitiesSavedSearchesDynamicExecuteV1QueryParams extends BaseUrlParams {
    includeTestData?: QueryParam;
}
export type PostEntitiesSavedSearchesDynamicExecuteV1ApiResponse = ApiResponsePayload;
export interface PostEntitiesSavedSearchesDynamicExecuteV1PostData {
}
export type PostEntitiesSavedSearchesDynamicExecuteV1ResponseMessage = BaseApiResponseMessage<PostEntitiesSavedSearchesDynamicExecuteV1ApiResponse>;
export interface PostEntitiesSavedSearchesDynamicExecuteV1RequestMessage extends BaseApiRequestMessage<PostEntitiesSavedSearchesDynamicExecuteV1QueryParams, PostEntitiesSavedSearchesDynamicExecuteV1PostData> {
    api: LoggingapiRequestApi;
    method: 'postEntitiesSavedSearchesDynamicExecuteV1';
}
export interface PostEntitiesSavedSearchesExecuteV1QueryParams extends BaseUrlParams {
    includeTestData?: QueryParam;
    mode?: QueryParam;
    version?: QueryParam;
    metadata?: QueryParam;
    detailed?: QueryParam;
}
export type PostEntitiesSavedSearchesExecuteV1ApiResponse = ApiResponsePayload;
export interface PostEntitiesSavedSearchesExecuteV1PostData {
}
export type PostEntitiesSavedSearchesExecuteV1ResponseMessage = BaseApiResponseMessage<PostEntitiesSavedSearchesExecuteV1ApiResponse>;
export interface PostEntitiesSavedSearchesExecuteV1RequestMessage extends BaseApiRequestMessage<PostEntitiesSavedSearchesExecuteV1QueryParams, PostEntitiesSavedSearchesExecuteV1PostData> {
    api: LoggingapiRequestApi;
    method: 'postEntitiesSavedSearchesExecuteV1';
}
export type PostEntitiesSavedSearchesIngestV1QueryParams = BaseUrlParams;
export type PostEntitiesSavedSearchesIngestV1ApiResponse = ApiResponsePayload;
export interface PostEntitiesSavedSearchesIngestV1PostData {
}
export type PostEntitiesSavedSearchesIngestV1ResponseMessage = BaseApiResponseMessage<PostEntitiesSavedSearchesIngestV1ApiResponse>;
export interface PostEntitiesSavedSearchesIngestV1RequestMessage extends BaseApiRequestMessage<PostEntitiesSavedSearchesIngestV1QueryParams, PostEntitiesSavedSearchesIngestV1PostData> {
    api: LoggingapiRequestApi;
    method: 'postEntitiesSavedSearchesIngestV1';
}
export type LoggingapiApiRequestMessage = GetEntitiesSavedSearchesExecuteV1RequestMessage | GetEntitiesSavedSearchesV1RequestMessage | PostEntitiesSavedSearchesExecuteV1RequestMessage;
export type LoggingapiApiResponseMessage = GetEntitiesSavedSearchesExecuteV1ResponseMessage | GetEntitiesSavedSearchesV1ResponseMessage | PostEntitiesSavedSearchesExecuteV1ResponseMessage;
export declare class LoggingapiApiBridge {
    private bridge;
    constructor(bridge: Bridge);
    getBridge(): Bridge<import("../../types").LocalData>;
    getEntitiesSavedSearchesExecuteV1(urlParams: GetEntitiesSavedSearchesExecuteV1QueryParams): Promise<GetEntitiesSavedSearchesExecuteV1ApiResponse>;
    getEntitiesSavedSearchesV1(urlParams: GetEntitiesSavedSearchesV1QueryParams): Promise<GetEntitiesSavedSearchesV1ApiResponse>;
    postEntitiesSavedSearchesExecuteV1(postBody: PostEntitiesSavedSearchesExecuteV1PostData, urlParams?: PostEntitiesSavedSearchesExecuteV1QueryParams): Promise<PostEntitiesSavedSearchesExecuteV1ApiResponse>;
}
