/**
 *
 * This file is initially generated from the configuration file at `config/apis/alerts.json`.
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

export type AlertsRequestApi = 'alerts';


 // types for deleteEntitiesSuppressedDevicesV1

 export interface DeleteEntitiesSuppressedDevicesV1QueryParams extends BaseUrlParams {
  ids?: QueryParam;
}

 export type DeleteEntitiesSuppressedDevicesV1ApiResponse = ApiResponsePayload<string>;

 

 export type DeleteEntitiesSuppressedDevicesV1ResponseMessage = BaseApiResponseMessage<DeleteEntitiesSuppressedDevicesV1ApiResponse>;

 
  export interface DeleteEntitiesSuppressedDevicesV1RequestMessage
    extends BaseApiRequestMessage<DeleteEntitiesSuppressedDevicesV1QueryParams> {
    api: AlertsRequestApi;
    method: 'deleteEntitiesSuppressedDevicesV1';
  }
 

 // types for getQueriesAlertsV1

 export interface GetQueriesAlertsV1QueryParams extends BaseUrlParams {
  filter?: string;
  limit?: QueryParam;
  offset?: QueryParam;
  q?: QueryParam;
  sort?: QueryParam;
}

 export type GetQueriesAlertsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetQueriesAlertsV1ResponseMessage = BaseApiResponseMessage<GetQueriesAlertsV1ApiResponse>;

 
  export interface GetQueriesAlertsV1RequestMessage
    extends BaseApiRequestMessage<GetQueriesAlertsV1QueryParams> {
    api: AlertsRequestApi;
    method: 'getQueriesAlertsV1';
  }
 

 // types for patchCombinedAlertsV2

 export type PatchCombinedAlertsV2QueryParams = BaseUrlParams;

 export type PatchCombinedAlertsV2ApiResponse = ApiResponsePayload<string>;

 export interface PatchCombinedAlertsV2PostData {}

 export type PatchCombinedAlertsV2ResponseMessage = BaseApiResponseMessage<PatchCombinedAlertsV2ApiResponse>;

 
  export interface PatchCombinedAlertsV2RequestMessage
    extends BaseApiRequestMessage<PatchCombinedAlertsV2QueryParams,PatchCombinedAlertsV2PostData > {
    api: AlertsRequestApi;
    method: 'patchCombinedAlertsV2';
  }
 

 // types for patchEntitiesAlertsV2

 export type PatchEntitiesAlertsV2QueryParams = BaseUrlParams;

 export type PatchEntitiesAlertsV2ApiResponse = ApiResponsePayload<string>;

 export interface PatchEntitiesAlertsV2PostData {}

 export type PatchEntitiesAlertsV2ResponseMessage = BaseApiResponseMessage<PatchEntitiesAlertsV2ApiResponse>;

 
  export interface PatchEntitiesAlertsV2RequestMessage
    extends BaseApiRequestMessage<PatchEntitiesAlertsV2QueryParams,PatchEntitiesAlertsV2PostData > {
    api: AlertsRequestApi;
    method: 'patchEntitiesAlertsV2';
  }
 

 // types for patchEntitiesSuppressedDevicesV1

 export interface PatchEntitiesSuppressedDevicesV1QueryParams extends BaseUrlParams {
  ids?: QueryParam;
}

 export type PatchEntitiesSuppressedDevicesV1ApiResponse = ApiResponsePayload<string>;

 export interface PatchEntitiesSuppressedDevicesV1PostData {}

 export type PatchEntitiesSuppressedDevicesV1ResponseMessage = BaseApiResponseMessage<PatchEntitiesSuppressedDevicesV1ApiResponse>;

 
  export interface PatchEntitiesSuppressedDevicesV1RequestMessage
    extends BaseApiRequestMessage<PatchEntitiesSuppressedDevicesV1QueryParams,PatchEntitiesSuppressedDevicesV1PostData > {
    api: AlertsRequestApi;
    method: 'patchEntitiesSuppressedDevicesV1';
  }
 

 // types for postAggregatesAlertsV1

 export interface PostAggregatesAlertsV1QueryParams extends BaseUrlParams {
  dateRanges?: QueryParam;
  field?: QueryParam;
  filter?: string;
  from?: QueryParam;
  include?: QueryParam;
  interval?: QueryParam;
  minDocCount?: QueryParam;
  missing?: QueryParam;
  name?: QueryParam;
  q?: QueryParam;
  ranges?: QueryParam;
  size?: QueryParam;
  sort?: QueryParam;
  subAggregates?: QueryParam;
  timeZone?: QueryParam;
  type?: QueryParam;
}

 export type PostAggregatesAlertsV1ApiResponse = ApiResponsePayload<string>;

 export interface PostAggregatesAlertsV1PostData {}

 export type PostAggregatesAlertsV1ResponseMessage = BaseApiResponseMessage<PostAggregatesAlertsV1ApiResponse>;

 
  export interface PostAggregatesAlertsV1RequestMessage
    extends BaseApiRequestMessage<PostAggregatesAlertsV1QueryParams,PostAggregatesAlertsV1PostData > {
    api: AlertsRequestApi;
    method: 'postAggregatesAlertsV1';
  }
 

 // types for postEntitiesAlertsV1

 export interface PostEntitiesAlertsV1QueryParams extends BaseUrlParams {
  ids?: QueryParam;
}

 export type PostEntitiesAlertsV1ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesAlertsV1PostData {}

 export type PostEntitiesAlertsV1ResponseMessage = BaseApiResponseMessage<PostEntitiesAlertsV1ApiResponse>;

 
  export interface PostEntitiesAlertsV1RequestMessage
    extends BaseApiRequestMessage<PostEntitiesAlertsV1QueryParams,PostEntitiesAlertsV1PostData > {
    api: AlertsRequestApi;
    method: 'postEntitiesAlertsV1';
  }
 

 // types for postEntitiesSuppressedDevicesV1

 export type PostEntitiesSuppressedDevicesV1QueryParams = BaseUrlParams;

 export type PostEntitiesSuppressedDevicesV1ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesSuppressedDevicesV1PostData {}

 export type PostEntitiesSuppressedDevicesV1ResponseMessage = BaseApiResponseMessage<PostEntitiesSuppressedDevicesV1ApiResponse>;

 
  export interface PostEntitiesSuppressedDevicesV1RequestMessage
    extends BaseApiRequestMessage<PostEntitiesSuppressedDevicesV1QueryParams,PostEntitiesSuppressedDevicesV1PostData > {
    api: AlertsRequestApi;
    method: 'postEntitiesSuppressedDevicesV1';
  }
 

// general types

export type AlertsApiRequestMessage =
  | DeleteEntitiesSuppressedDevicesV1RequestMessage
  | GetQueriesAlertsV1RequestMessage
  | PatchCombinedAlertsV2RequestMessage
  | PatchEntitiesAlertsV2RequestMessage
  | PatchEntitiesSuppressedDevicesV1RequestMessage
  | PostAggregatesAlertsV1RequestMessage
  | PostEntitiesAlertsV1RequestMessage
  | PostEntitiesSuppressedDevicesV1RequestMessage;

export type AlertsApiResponseMessage =
  | DeleteEntitiesSuppressedDevicesV1ResponseMessage
  | GetQueriesAlertsV1ResponseMessage
  | PatchCombinedAlertsV2ResponseMessage
  | PatchEntitiesAlertsV2ResponseMessage
  | PatchEntitiesSuppressedDevicesV1ResponseMessage
  | PostAggregatesAlertsV1ResponseMessage
  | PostEntitiesAlertsV1ResponseMessage
  | PostEntitiesSuppressedDevicesV1ResponseMessage;