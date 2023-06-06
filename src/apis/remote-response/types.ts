/**
 *
 * This file is initially generated from the configuration file at `config/apis/remote-response.json`.
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

export type RemoteResponseRequestApi = 'remoteResponse';


 // types for getQueriesScriptsV1

 export interface GetQueriesScriptsV1QueryParams extends BaseUrlParams {
  filter?: string;
  limit?: QueryParam;
  offset?: QueryParam;
  sort?: QueryParam;
}

 export type GetQueriesScriptsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetQueriesScriptsV1ResponseMessage = BaseApiResponseMessage<GetQueriesScriptsV1ApiResponse>;

 
  export interface GetQueriesScriptsV1RequestMessage
    extends BaseApiRequestMessage<GetQueriesScriptsV1QueryParams> {
    api: RemoteResponseRequestApi;
    method: 'getQueriesScriptsV1';
  }
 

 // types for postEntitiesScriptsGetV2

 export type PostEntitiesScriptsGetV2QueryParams = BaseUrlParams;

 export type PostEntitiesScriptsGetV2ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesScriptsGetV2PostData {}

 export type PostEntitiesScriptsGetV2ResponseMessage = BaseApiResponseMessage<PostEntitiesScriptsGetV2ApiResponse>;

 
  export interface PostEntitiesScriptsGetV2RequestMessage
    extends BaseApiRequestMessage<PostEntitiesScriptsGetV2QueryParams,PostEntitiesScriptsGetV2PostData > {
    api: RemoteResponseRequestApi;
    method: 'postEntitiesScriptsGetV2';
  }
 

// general types

export type RemoteResponseApiRequestMessage =
  | GetQueriesScriptsV1RequestMessage
  | PostEntitiesScriptsGetV2RequestMessage;

export type RemoteResponseApiResponseMessage =
  | GetQueriesScriptsV1ResponseMessage
  | PostEntitiesScriptsGetV2ResponseMessage;