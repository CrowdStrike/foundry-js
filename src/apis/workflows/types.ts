/**
 *
 * This file is initially generated from the configuration file at `config/apis/workflows.json`.
 *
 * Currently there isn't enough information there to fully generate this file so you will need to manually
 * edit it and commit your changes.
 *
 * If new Api methods are added you will need to re-generate overwriting this file and then deal with the
 * git diff to get just the change you want
 *
 * ```
 * yarn cs-gen platform-apis
 * ```
 *
 **/

import type {
  BaseApiRequestMessage,
  BaseApiResponseMessage,
  ApiResponsePayload,
  BaseUrlParams,
  QueryParam
} from '../../types';

export type WorkflowsRequestApi = 'workflows';


 // types for getEntitiesExecutionResultsV1

 export interface GetEntitiesExecutionResultsV1QueryParams extends BaseUrlParams {
  ids: QueryParam;
}

 export type GetEntitiesExecutionResultsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetEntitiesExecutionResultsV1ResponseMessage = BaseApiResponseMessage<GetEntitiesExecutionResultsV1ApiResponse>;

 
  export interface GetEntitiesExecutionResultsV1RequestMessage
    extends BaseApiRequestMessage<GetEntitiesExecutionResultsV1QueryParams> {
    api: WorkflowsRequestApi;
    method: 'getEntitiesExecutionResultsV1';
  }
 

 // types for postEntitiesExecuteV1

 export interface PostEntitiesExecuteV1QueryParams extends BaseUrlParams {
  definitionId?: QueryParam;
  name?: QueryParam;
  key?: QueryParam;
  depth?: QueryParam;
}

 export type PostEntitiesExecuteV1ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesExecuteV1PostData {}

 export type PostEntitiesExecuteV1ResponseMessage = BaseApiResponseMessage<PostEntitiesExecuteV1ApiResponse>;

 
  export interface PostEntitiesExecuteV1RequestMessage
    extends BaseApiRequestMessage<PostEntitiesExecuteV1QueryParams,PostEntitiesExecuteV1PostData > {
    api: WorkflowsRequestApi;
    method: 'postEntitiesExecuteV1';
  }
 

 // types for postEntitiesExecutionActionsV1

 export interface PostEntitiesExecutionActionsV1QueryParams extends BaseUrlParams {
  actionName: QueryParam;
}

 export type PostEntitiesExecutionActionsV1ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesExecutionActionsV1PostData {}

 export type PostEntitiesExecutionActionsV1ResponseMessage = BaseApiResponseMessage<PostEntitiesExecutionActionsV1ApiResponse>;

 
  export interface PostEntitiesExecutionActionsV1RequestMessage
    extends BaseApiRequestMessage<PostEntitiesExecutionActionsV1QueryParams,PostEntitiesExecutionActionsV1PostData > {
    api: WorkflowsRequestApi;
    method: 'postEntitiesExecutionActionsV1';
  }
 

// general types

export type WorkflowsApiRequestMessage =
  | GetEntitiesExecutionResultsV1RequestMessage
  | PostEntitiesExecuteV1RequestMessage
  | PostEntitiesExecutionActionsV1RequestMessage;

export type WorkflowsApiResponseMessage =
  | GetEntitiesExecutionResultsV1ResponseMessage
  | PostEntitiesExecuteV1ResponseMessage
  | PostEntitiesExecutionActionsV1ResponseMessage;