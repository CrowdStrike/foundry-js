/**
 *
 * This file is initially generated from the configuration file at `config/apis/actors.json`.
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

export type ActorsRequestApi = 'actors';


 // types for getEntitiesActorsGetV2

 export interface GetEntitiesActorsGetV2QueryParams extends BaseUrlParams {
  ids?: QueryParam;
}

 export type GetEntitiesActorsGetV2ApiResponse = ApiResponsePayload<string>;

 

 export type GetEntitiesActorsGetV2ResponseMessage = BaseApiResponseMessage<GetEntitiesActorsGetV2ApiResponse>;

 
  export interface GetEntitiesActorsGetV2RequestMessage
    extends BaseApiRequestMessage<GetEntitiesActorsGetV2QueryParams> {
    api: ActorsRequestApi;
    method: 'getEntitiesActorsGetV2';
  }
 

 // types for getQueriesActorsV2

 export interface GetQueriesActorsV2QueryParams extends BaseUrlParams {
  filter?: string;
  limit?: QueryParam;
  offset?: QueryParam;
  q?: QueryParam;
  sort?: QueryParam;
}

 export type GetQueriesActorsV2ApiResponse = ApiResponsePayload<string>;

 

 export type GetQueriesActorsV2ResponseMessage = BaseApiResponseMessage<GetQueriesActorsV2ApiResponse>;

 
  export interface GetQueriesActorsV2RequestMessage
    extends BaseApiRequestMessage<GetQueriesActorsV2QueryParams> {
    api: ActorsRequestApi;
    method: 'getQueriesActorsV2';
  }
 

 // types for postAggregatesActorsGetV2

 export type PostAggregatesActorsGetV2QueryParams = BaseUrlParams;

 export type PostAggregatesActorsGetV2ApiResponse = ApiResponsePayload<string>;

 export interface PostAggregatesActorsGetV2PostData {}

 export type PostAggregatesActorsGetV2ResponseMessage = BaseApiResponseMessage<PostAggregatesActorsGetV2ApiResponse>;

 
  export interface PostAggregatesActorsGetV2RequestMessage
    extends BaseApiRequestMessage<PostAggregatesActorsGetV2QueryParams,PostAggregatesActorsGetV2PostData > {
    api: ActorsRequestApi;
    method: 'postAggregatesActorsGetV2';
  }
 

 // types for postEntitiesActorsGetV2

 export interface PostEntitiesActorsGetV2QueryParams extends BaseUrlParams {
  ids?: QueryParam;
}

 export type PostEntitiesActorsGetV2ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesActorsGetV2PostData {}

 export type PostEntitiesActorsGetV2ResponseMessage = BaseApiResponseMessage<PostEntitiesActorsGetV2ApiResponse>;

 
  export interface PostEntitiesActorsGetV2RequestMessage
    extends BaseApiRequestMessage<PostEntitiesActorsGetV2QueryParams,PostEntitiesActorsGetV2PostData > {
    api: ActorsRequestApi;
    method: 'postEntitiesActorsGetV2';
  }
 

 // types for postEntitiesMitreV1

 export type PostEntitiesMitreV1QueryParams = BaseUrlParams;

 export type PostEntitiesMitreV1ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesMitreV1PostData {}

 export type PostEntitiesMitreV1ResponseMessage = BaseApiResponseMessage<PostEntitiesMitreV1ApiResponse>;

 
  export interface PostEntitiesMitreV1RequestMessage
    extends BaseApiRequestMessage<PostEntitiesMitreV1QueryParams,PostEntitiesMitreV1PostData > {
    api: ActorsRequestApi;
    method: 'postEntitiesMitreV1';
  }
 

// general types

export type ActorsApiRequestMessage =
  | GetEntitiesActorsGetV2RequestMessage
  | GetQueriesActorsV2RequestMessage
  | PostAggregatesActorsGetV2RequestMessage
  | PostEntitiesActorsGetV2RequestMessage
  | PostEntitiesMitreV1RequestMessage;

export type ActorsApiResponseMessage =
  | GetEntitiesActorsGetV2ResponseMessage
  | GetQueriesActorsV2ResponseMessage
  | PostAggregatesActorsGetV2ResponseMessage
  | PostEntitiesActorsGetV2ResponseMessage
  | PostEntitiesMitreV1ResponseMessage;