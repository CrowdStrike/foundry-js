/**
 *
 * This file is initially generated from the configuration file at `config/apis/incidents.json`.
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

export type IncidentsRequestApi = 'incidents';


 // types for getCombinedCrowdscoresV1

 export interface GetCombinedCrowdscoresV1QueryParams extends BaseUrlParams {
  filter?: string;
  limit?: QueryParam;
  offset?: QueryParam;
  sort?: QueryParam;
}

 export type GetCombinedCrowdscoresV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetCombinedCrowdscoresV1ResponseMessage = BaseApiResponseMessage<GetCombinedCrowdscoresV1ApiResponse>;

 
  export interface GetCombinedCrowdscoresV1RequestMessage
    extends BaseApiRequestMessage<GetCombinedCrowdscoresV1QueryParams> {
    api: IncidentsRequestApi;
    method: 'getCombinedCrowdscoresV1';
  }
 

 // types for getQueriesBehaviorsV1

 export interface GetQueriesBehaviorsV1QueryParams extends BaseUrlParams {
  filter?: string;
  limit?: QueryParam;
  offset?: QueryParam;
  sort?: QueryParam;
}

 export type GetQueriesBehaviorsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetQueriesBehaviorsV1ResponseMessage = BaseApiResponseMessage<GetQueriesBehaviorsV1ApiResponse>;

 
  export interface GetQueriesBehaviorsV1RequestMessage
    extends BaseApiRequestMessage<GetQueriesBehaviorsV1QueryParams> {
    api: IncidentsRequestApi;
    method: 'getQueriesBehaviorsV1';
  }
 

 // types for getQueriesIncidentsV1

 export interface GetQueriesIncidentsV1QueryParams extends BaseUrlParams {
  filter?: string;
  limit?: QueryParam;
  offset?: QueryParam;
  sort?: QueryParam;
}

 export type GetQueriesIncidentsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetQueriesIncidentsV1ResponseMessage = BaseApiResponseMessage<GetQueriesIncidentsV1ApiResponse>;

 
  export interface GetQueriesIncidentsV1RequestMessage
    extends BaseApiRequestMessage<GetQueriesIncidentsV1QueryParams> {
    api: IncidentsRequestApi;
    method: 'getQueriesIncidentsV1';
  }
 

 // types for postAggregatesBehaviorsGetV1

 export type PostAggregatesBehaviorsGetV1QueryParams = BaseUrlParams;

 export type PostAggregatesBehaviorsGetV1ApiResponse = ApiResponsePayload<string>;

 export interface PostAggregatesBehaviorsGetV1PostData {}

 export type PostAggregatesBehaviorsGetV1ResponseMessage = BaseApiResponseMessage<PostAggregatesBehaviorsGetV1ApiResponse>;

 
  export interface PostAggregatesBehaviorsGetV1RequestMessage
    extends BaseApiRequestMessage<PostAggregatesBehaviorsGetV1QueryParams,PostAggregatesBehaviorsGetV1PostData > {
    api: IncidentsRequestApi;
    method: 'postAggregatesBehaviorsGetV1';
  }
 

 // types for postAggregatesIncidentsGetV1

 export type PostAggregatesIncidentsGetV1QueryParams = BaseUrlParams;

 export type PostAggregatesIncidentsGetV1ApiResponse = ApiResponsePayload<string>;

 export interface PostAggregatesIncidentsGetV1PostData {}

 export type PostAggregatesIncidentsGetV1ResponseMessage = BaseApiResponseMessage<PostAggregatesIncidentsGetV1ApiResponse>;

 
  export interface PostAggregatesIncidentsGetV1RequestMessage
    extends BaseApiRequestMessage<PostAggregatesIncidentsGetV1QueryParams,PostAggregatesIncidentsGetV1PostData > {
    api: IncidentsRequestApi;
    method: 'postAggregatesIncidentsGetV1';
  }
 

 // types for postEntitiesBehaviorsGetV1

 export type PostEntitiesBehaviorsGetV1QueryParams = BaseUrlParams;

 export type PostEntitiesBehaviorsGetV1ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesBehaviorsGetV1PostData {}

 export type PostEntitiesBehaviorsGetV1ResponseMessage = BaseApiResponseMessage<PostEntitiesBehaviorsGetV1ApiResponse>;

 
  export interface PostEntitiesBehaviorsGetV1RequestMessage
    extends BaseApiRequestMessage<PostEntitiesBehaviorsGetV1QueryParams,PostEntitiesBehaviorsGetV1PostData > {
    api: IncidentsRequestApi;
    method: 'postEntitiesBehaviorsGetV1';
  }
 

 // types for postEntitiesIncidentActionsV1

 export interface PostEntitiesIncidentActionsV1QueryParams extends BaseUrlParams {
  note?: QueryParam;
}

 export type PostEntitiesIncidentActionsV1ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesIncidentActionsV1PostData {}

 export type PostEntitiesIncidentActionsV1ResponseMessage = BaseApiResponseMessage<PostEntitiesIncidentActionsV1ApiResponse>;

 
  export interface PostEntitiesIncidentActionsV1RequestMessage
    extends BaseApiRequestMessage<PostEntitiesIncidentActionsV1QueryParams,PostEntitiesIncidentActionsV1PostData > {
    api: IncidentsRequestApi;
    method: 'postEntitiesIncidentActionsV1';
  }
 

 // types for postEntitiesIncidentsGetV1

 export type PostEntitiesIncidentsGetV1QueryParams = BaseUrlParams;

 export type PostEntitiesIncidentsGetV1ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesIncidentsGetV1PostData {}

 export type PostEntitiesIncidentsGetV1ResponseMessage = BaseApiResponseMessage<PostEntitiesIncidentsGetV1ApiResponse>;

 
  export interface PostEntitiesIncidentsGetV1RequestMessage
    extends BaseApiRequestMessage<PostEntitiesIncidentsGetV1QueryParams,PostEntitiesIncidentsGetV1PostData > {
    api: IncidentsRequestApi;
    method: 'postEntitiesIncidentsGetV1';
  }
 

// general types

export type IncidentsApiRequestMessage =
  | GetCombinedCrowdscoresV1RequestMessage
  | GetQueriesBehaviorsV1RequestMessage
  | GetQueriesIncidentsV1RequestMessage
  | PostAggregatesBehaviorsGetV1RequestMessage
  | PostAggregatesIncidentsGetV1RequestMessage
  | PostEntitiesBehaviorsGetV1RequestMessage
  | PostEntitiesIncidentActionsV1RequestMessage
  | PostEntitiesIncidentsGetV1RequestMessage;

export type IncidentsApiResponseMessage =
  | GetCombinedCrowdscoresV1ResponseMessage
  | GetQueriesBehaviorsV1ResponseMessage
  | GetQueriesIncidentsV1ResponseMessage
  | PostAggregatesBehaviorsGetV1ResponseMessage
  | PostAggregatesIncidentsGetV1ResponseMessage
  | PostEntitiesBehaviorsGetV1ResponseMessage
  | PostEntitiesIncidentActionsV1ResponseMessage
  | PostEntitiesIncidentsGetV1ResponseMessage;