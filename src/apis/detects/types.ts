/**
 *
 * This file is initially generated from the configuration file at `config/apis/detects.json`.
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

export type DetectsRequestApi = 'detects';


 // types for getEntitiesSuppressedDevicesV1

 export interface GetEntitiesSuppressedDevicesV1QueryParams extends BaseUrlParams {
  ids?: QueryParam;
}

 export type GetEntitiesSuppressedDevicesV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetEntitiesSuppressedDevicesV1ResponseMessage = BaseApiResponseMessage<GetEntitiesSuppressedDevicesV1ApiResponse>;

 
  export interface GetEntitiesSuppressedDevicesV1RequestMessage
    extends BaseApiRequestMessage<GetEntitiesSuppressedDevicesV1QueryParams> {
    api: DetectsRequestApi;
    method: 'getEntitiesSuppressedDevicesV1';
  }
 

 // types for patchEntitiesDetectsV2

 export type PatchEntitiesDetectsV2QueryParams = BaseUrlParams;

 export type PatchEntitiesDetectsV2ApiResponse = ApiResponsePayload<string>;

 export interface PatchEntitiesDetectsV2PostData {}

 export type PatchEntitiesDetectsV2ResponseMessage = BaseApiResponseMessage<PatchEntitiesDetectsV2ApiResponse>;

 
  export interface PatchEntitiesDetectsV2RequestMessage
    extends BaseApiRequestMessage<PatchEntitiesDetectsV2QueryParams,PatchEntitiesDetectsV2PostData > {
    api: DetectsRequestApi;
    method: 'patchEntitiesDetectsV2';
  }
 

 // types for patchQueriesDetectsV1

 export type PatchQueriesDetectsV1QueryParams = BaseUrlParams;

 export type PatchQueriesDetectsV1ApiResponse = ApiResponsePayload<string>;

 export interface PatchQueriesDetectsV1PostData {}

 export type PatchQueriesDetectsV1ResponseMessage = BaseApiResponseMessage<PatchQueriesDetectsV1ApiResponse>;

 
  export interface PatchQueriesDetectsV1RequestMessage
    extends BaseApiRequestMessage<PatchQueriesDetectsV1QueryParams,PatchQueriesDetectsV1PostData > {
    api: DetectsRequestApi;
    method: 'patchQueriesDetectsV1';
  }
 

 // types for patchQueriesDetectsV2

 export type PatchQueriesDetectsV2QueryParams = BaseUrlParams;

 export type PatchQueriesDetectsV2ApiResponse = ApiResponsePayload<string>;

 export interface PatchQueriesDetectsV2PostData {}

 export type PatchQueriesDetectsV2ResponseMessage = BaseApiResponseMessage<PatchQueriesDetectsV2ApiResponse>;

 
  export interface PatchQueriesDetectsV2RequestMessage
    extends BaseApiRequestMessage<PatchQueriesDetectsV2QueryParams,PatchQueriesDetectsV2PostData > {
    api: DetectsRequestApi;
    method: 'patchQueriesDetectsV2';
  }
 

 // types for postAggregatesDetectsGetV1

 export type PostAggregatesDetectsGetV1QueryParams = BaseUrlParams;

 export type PostAggregatesDetectsGetV1ApiResponse = ApiResponsePayload<string>;

 export interface PostAggregatesDetectsGetV1PostData {}

 export type PostAggregatesDetectsGetV1ResponseMessage = BaseApiResponseMessage<PostAggregatesDetectsGetV1ApiResponse>;

 
  export interface PostAggregatesDetectsGetV1RequestMessage
    extends BaseApiRequestMessage<PostAggregatesDetectsGetV1QueryParams,PostAggregatesDetectsGetV1PostData > {
    api: DetectsRequestApi;
    method: 'postAggregatesDetectsGetV1';
  }
 

 // types for postEntitiesSummariesGetV1

 export type PostEntitiesSummariesGetV1QueryParams = BaseUrlParams;

 export type PostEntitiesSummariesGetV1ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesSummariesGetV1PostData {}

 export type PostEntitiesSummariesGetV1ResponseMessage = BaseApiResponseMessage<PostEntitiesSummariesGetV1ApiResponse>;

 
  export interface PostEntitiesSummariesGetV1RequestMessage
    extends BaseApiRequestMessage<PostEntitiesSummariesGetV1QueryParams,PostEntitiesSummariesGetV1PostData > {
    api: DetectsRequestApi;
    method: 'postEntitiesSummariesGetV1';
  }
 

 // types for postEntitiesSuppressedDevicesV1

 export interface PostEntitiesSuppressedDevicesV1QueryParams extends BaseUrlParams {
  ids?: QueryParam;
}

 export type PostEntitiesSuppressedDevicesV1ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesSuppressedDevicesV1PostData {}

 export type PostEntitiesSuppressedDevicesV1ResponseMessage = BaseApiResponseMessage<PostEntitiesSuppressedDevicesV1ApiResponse>;

 
  export interface PostEntitiesSuppressedDevicesV1RequestMessage
    extends BaseApiRequestMessage<PostEntitiesSuppressedDevicesV1QueryParams,PostEntitiesSuppressedDevicesV1PostData > {
    api: DetectsRequestApi;
    method: 'postEntitiesSuppressedDevicesV1';
  }
 

// general types

export type DetectsApiRequestMessage =
  | GetEntitiesSuppressedDevicesV1RequestMessage
  | PatchEntitiesDetectsV2RequestMessage
  | PatchQueriesDetectsV1RequestMessage
  | PatchQueriesDetectsV2RequestMessage
  | PostAggregatesDetectsGetV1RequestMessage
  | PostEntitiesSummariesGetV1RequestMessage
  | PostEntitiesSuppressedDevicesV1RequestMessage;

export type DetectsApiResponseMessage =
  | GetEntitiesSuppressedDevicesV1ResponseMessage
  | PatchEntitiesDetectsV2ResponseMessage
  | PatchQueriesDetectsV1ResponseMessage
  | PatchQueriesDetectsV2ResponseMessage
  | PostAggregatesDetectsGetV1ResponseMessage
  | PostEntitiesSummariesGetV1ResponseMessage
  | PostEntitiesSuppressedDevicesV1ResponseMessage;