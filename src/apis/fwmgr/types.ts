/**
 *
 * This file is initially generated from the configuration file at `config/apis/fwmgr.json`.
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

export type FwmgrRequestApi = 'fwmgr';


 // types for deleteEntitiesNetworkLocationsV1

 export interface DeleteEntitiesNetworkLocationsV1QueryParams extends BaseUrlParams {
  ids: QueryParam;
  comment?: QueryParam;
}

 export type DeleteEntitiesNetworkLocationsV1ApiResponse = ApiResponsePayload<string>;

 

 export type DeleteEntitiesNetworkLocationsV1ResponseMessage = BaseApiResponseMessage<DeleteEntitiesNetworkLocationsV1ApiResponse>;

 
  export interface DeleteEntitiesNetworkLocationsV1RequestMessage
    extends BaseApiRequestMessage<DeleteEntitiesNetworkLocationsV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'deleteEntitiesNetworkLocationsV1';
  }
 

 // types for deleteEntitiesPoliciesV1

 export interface DeleteEntitiesPoliciesV1QueryParams extends BaseUrlParams {
  ids: QueryParam;
}

 export type DeleteEntitiesPoliciesV1ApiResponse = ApiResponsePayload<string>;

 

 export type DeleteEntitiesPoliciesV1ResponseMessage = BaseApiResponseMessage<DeleteEntitiesPoliciesV1ApiResponse>;

 
  export interface DeleteEntitiesPoliciesV1RequestMessage
    extends BaseApiRequestMessage<DeleteEntitiesPoliciesV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'deleteEntitiesPoliciesV1';
  }
 

 // types for deleteEntitiesRuleGroupsV1

 export interface DeleteEntitiesRuleGroupsV1QueryParams extends BaseUrlParams {
  ids: QueryParam;
  comment?: QueryParam;
}

 export type DeleteEntitiesRuleGroupsV1ApiResponse = ApiResponsePayload<string>;

 

 export type DeleteEntitiesRuleGroupsV1ResponseMessage = BaseApiResponseMessage<DeleteEntitiesRuleGroupsV1ApiResponse>;

 
  export interface DeleteEntitiesRuleGroupsV1RequestMessage
    extends BaseApiRequestMessage<DeleteEntitiesRuleGroupsV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'deleteEntitiesRuleGroupsV1';
  }
 

 // types for getEntitiesEventsV1

 export interface GetEntitiesEventsV1QueryParams extends BaseUrlParams {
  ids: QueryParam;
}

 export type GetEntitiesEventsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetEntitiesEventsV1ResponseMessage = BaseApiResponseMessage<GetEntitiesEventsV1ApiResponse>;

 
  export interface GetEntitiesEventsV1RequestMessage
    extends BaseApiRequestMessage<GetEntitiesEventsV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getEntitiesEventsV1';
  }
 

 // types for getEntitiesFirewallFieldsV1

 export interface GetEntitiesFirewallFieldsV1QueryParams extends BaseUrlParams {
  ids: QueryParam;
}

 export type GetEntitiesFirewallFieldsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetEntitiesFirewallFieldsV1ResponseMessage = BaseApiResponseMessage<GetEntitiesFirewallFieldsV1ApiResponse>;

 
  export interface GetEntitiesFirewallFieldsV1RequestMessage
    extends BaseApiRequestMessage<GetEntitiesFirewallFieldsV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getEntitiesFirewallFieldsV1';
  }
 

 // types for getEntitiesNetworkLocationsDetailsV1

 export interface GetEntitiesNetworkLocationsDetailsV1QueryParams extends BaseUrlParams {
  ids: QueryParam;
}

 export type GetEntitiesNetworkLocationsDetailsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetEntitiesNetworkLocationsDetailsV1ResponseMessage = BaseApiResponseMessage<GetEntitiesNetworkLocationsDetailsV1ApiResponse>;

 
  export interface GetEntitiesNetworkLocationsDetailsV1RequestMessage
    extends BaseApiRequestMessage<GetEntitiesNetworkLocationsDetailsV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getEntitiesNetworkLocationsDetailsV1';
  }
 

 // types for getEntitiesNetworkLocationsV1

 export interface GetEntitiesNetworkLocationsV1QueryParams extends BaseUrlParams {
  ids: QueryParam;
}

 export type GetEntitiesNetworkLocationsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetEntitiesNetworkLocationsV1ResponseMessage = BaseApiResponseMessage<GetEntitiesNetworkLocationsV1ApiResponse>;

 
  export interface GetEntitiesNetworkLocationsV1RequestMessage
    extends BaseApiRequestMessage<GetEntitiesNetworkLocationsV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getEntitiesNetworkLocationsV1';
  }
 

 // types for getEntitiesPlatformsV1

 export interface GetEntitiesPlatformsV1QueryParams extends BaseUrlParams {
  ids: QueryParam;
}

 export type GetEntitiesPlatformsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetEntitiesPlatformsV1ResponseMessage = BaseApiResponseMessage<GetEntitiesPlatformsV1ApiResponse>;

 
  export interface GetEntitiesPlatformsV1RequestMessage
    extends BaseApiRequestMessage<GetEntitiesPlatformsV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getEntitiesPlatformsV1';
  }
 

 // types for getEntitiesPoliciesV1

 export interface GetEntitiesPoliciesV1QueryParams extends BaseUrlParams {
  ids: QueryParam;
}

 export type GetEntitiesPoliciesV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetEntitiesPoliciesV1ResponseMessage = BaseApiResponseMessage<GetEntitiesPoliciesV1ApiResponse>;

 
  export interface GetEntitiesPoliciesV1RequestMessage
    extends BaseApiRequestMessage<GetEntitiesPoliciesV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getEntitiesPoliciesV1';
  }
 

 // types for getEntitiesRuleGroupsV1

 export interface GetEntitiesRuleGroupsV1QueryParams extends BaseUrlParams {
  ids: QueryParam;
}

 export type GetEntitiesRuleGroupsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetEntitiesRuleGroupsV1ResponseMessage = BaseApiResponseMessage<GetEntitiesRuleGroupsV1ApiResponse>;

 
  export interface GetEntitiesRuleGroupsV1RequestMessage
    extends BaseApiRequestMessage<GetEntitiesRuleGroupsV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getEntitiesRuleGroupsV1';
  }
 

 // types for getEntitiesRulesV1

 export interface GetEntitiesRulesV1QueryParams extends BaseUrlParams {
  ids: QueryParam;
}

 export type GetEntitiesRulesV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetEntitiesRulesV1ResponseMessage = BaseApiResponseMessage<GetEntitiesRulesV1ApiResponse>;

 
  export interface GetEntitiesRulesV1RequestMessage
    extends BaseApiRequestMessage<GetEntitiesRulesV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getEntitiesRulesV1';
  }
 

 // types for getLibraryEntitiesRuleGroupsV1

 export interface GetLibraryEntitiesRuleGroupsV1QueryParams extends BaseUrlParams {
  ids: QueryParam;
}

 export type GetLibraryEntitiesRuleGroupsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetLibraryEntitiesRuleGroupsV1ResponseMessage = BaseApiResponseMessage<GetLibraryEntitiesRuleGroupsV1ApiResponse>;

 
  export interface GetLibraryEntitiesRuleGroupsV1RequestMessage
    extends BaseApiRequestMessage<GetLibraryEntitiesRuleGroupsV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getLibraryEntitiesRuleGroupsV1';
  }
 

 // types for getLibraryQueriesRuleGroupsV1

 export interface GetLibraryQueriesRuleGroupsV1QueryParams extends BaseUrlParams {
  sort?: QueryParam;
  filter?: string;
  q?: QueryParam;
  offset?: QueryParam;
  limit?: QueryParam;
}

 export type GetLibraryQueriesRuleGroupsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetLibraryQueriesRuleGroupsV1ResponseMessage = BaseApiResponseMessage<GetLibraryQueriesRuleGroupsV1ApiResponse>;

 
  export interface GetLibraryQueriesRuleGroupsV1RequestMessage
    extends BaseApiRequestMessage<GetLibraryQueriesRuleGroupsV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getLibraryQueriesRuleGroupsV1';
  }
 

 // types for getQueriesEventsV1

 export interface GetQueriesEventsV1QueryParams extends BaseUrlParams {
  sort?: QueryParam;
  filter?: string;
  q?: QueryParam;
  offset?: QueryParam;
  limit?: QueryParam;
}

 export type GetQueriesEventsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetQueriesEventsV1ResponseMessage = BaseApiResponseMessage<GetQueriesEventsV1ApiResponse>;

 
  export interface GetQueriesEventsV1RequestMessage
    extends BaseApiRequestMessage<GetQueriesEventsV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getQueriesEventsV1';
  }
 

 // types for getQueriesFirewallFieldsV1

 export interface GetQueriesFirewallFieldsV1QueryParams extends BaseUrlParams {
  platform?: QueryParam;
  offset?: QueryParam;
  limit?: QueryParam;
}

 export type GetQueriesFirewallFieldsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetQueriesFirewallFieldsV1ResponseMessage = BaseApiResponseMessage<GetQueriesFirewallFieldsV1ApiResponse>;

 
  export interface GetQueriesFirewallFieldsV1RequestMessage
    extends BaseApiRequestMessage<GetQueriesFirewallFieldsV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getQueriesFirewallFieldsV1';
  }
 

 // types for getQueriesNetworkLocationsV1

 export interface GetQueriesNetworkLocationsV1QueryParams extends BaseUrlParams {
  filter?: string;
  limit?: QueryParam;
  offset?: QueryParam;
  q?: QueryParam;
  sort?: QueryParam;
}

 export type GetQueriesNetworkLocationsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetQueriesNetworkLocationsV1ResponseMessage = BaseApiResponseMessage<GetQueriesNetworkLocationsV1ApiResponse>;

 
  export interface GetQueriesNetworkLocationsV1RequestMessage
    extends BaseApiRequestMessage<GetQueriesNetworkLocationsV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getQueriesNetworkLocationsV1';
  }
 

 // types for getQueriesPlatformsV1

 export interface GetQueriesPlatformsV1QueryParams extends BaseUrlParams {
  offset?: QueryParam;
  limit?: QueryParam;
}

 export type GetQueriesPlatformsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetQueriesPlatformsV1ResponseMessage = BaseApiResponseMessage<GetQueriesPlatformsV1ApiResponse>;

 
  export interface GetQueriesPlatformsV1RequestMessage
    extends BaseApiRequestMessage<GetQueriesPlatformsV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getQueriesPlatformsV1';
  }
 

 // types for getQueriesPolicyRulesV1

 export interface GetQueriesPolicyRulesV1QueryParams extends BaseUrlParams {
  id?: QueryParam;
  sort?: QueryParam;
  filter?: string;
  q?: QueryParam;
  offset?: QueryParam;
  limit?: QueryParam;
}

 export type GetQueriesPolicyRulesV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetQueriesPolicyRulesV1ResponseMessage = BaseApiResponseMessage<GetQueriesPolicyRulesV1ApiResponse>;

 
  export interface GetQueriesPolicyRulesV1RequestMessage
    extends BaseApiRequestMessage<GetQueriesPolicyRulesV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getQueriesPolicyRulesV1';
  }
 

 // types for getQueriesRuleGroupsV1

 export interface GetQueriesRuleGroupsV1QueryParams extends BaseUrlParams {
  sort?: QueryParam;
  filter?: string;
  q?: QueryParam;
  offset?: QueryParam;
  limit?: QueryParam;
}

 export type GetQueriesRuleGroupsV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetQueriesRuleGroupsV1ResponseMessage = BaseApiResponseMessage<GetQueriesRuleGroupsV1ApiResponse>;

 
  export interface GetQueriesRuleGroupsV1RequestMessage
    extends BaseApiRequestMessage<GetQueriesRuleGroupsV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getQueriesRuleGroupsV1';
  }
 

 // types for getQueriesRulesV1

 export interface GetQueriesRulesV1QueryParams extends BaseUrlParams {
  sort?: QueryParam;
  filter?: string;
  q?: QueryParam;
  offset?: QueryParam;
  limit?: QueryParam;
}

 export type GetQueriesRulesV1ApiResponse = ApiResponsePayload<string>;

 

 export type GetQueriesRulesV1ResponseMessage = BaseApiResponseMessage<GetQueriesRulesV1ApiResponse>;

 
  export interface GetQueriesRulesV1RequestMessage
    extends BaseApiRequestMessage<GetQueriesRulesV1QueryParams> {
    api: FwmgrRequestApi;
    method: 'getQueriesRulesV1';
  }
 

 // types for patchEntitiesNetworkLocationsV1

 export interface PatchEntitiesNetworkLocationsV1QueryParams extends BaseUrlParams {
  comment?: QueryParam;
}

 export type PatchEntitiesNetworkLocationsV1ApiResponse = ApiResponsePayload<string>;

 export interface PatchEntitiesNetworkLocationsV1PostData {}

 export type PatchEntitiesNetworkLocationsV1ResponseMessage = BaseApiResponseMessage<PatchEntitiesNetworkLocationsV1ApiResponse>;

 
  export interface PatchEntitiesNetworkLocationsV1RequestMessage
    extends BaseApiRequestMessage<PatchEntitiesNetworkLocationsV1QueryParams,PatchEntitiesNetworkLocationsV1PostData > {
    api: FwmgrRequestApi;
    method: 'patchEntitiesNetworkLocationsV1';
  }
 

 // types for patchEntitiesRuleGroupsV1

 export interface PatchEntitiesRuleGroupsV1QueryParams extends BaseUrlParams {
  comment?: QueryParam;
}

 export type PatchEntitiesRuleGroupsV1ApiResponse = ApiResponsePayload<string>;

 export interface PatchEntitiesRuleGroupsV1PostData {}

 export type PatchEntitiesRuleGroupsV1ResponseMessage = BaseApiResponseMessage<PatchEntitiesRuleGroupsV1ApiResponse>;

 
  export interface PatchEntitiesRuleGroupsV1RequestMessage
    extends BaseApiRequestMessage<PatchEntitiesRuleGroupsV1QueryParams,PatchEntitiesRuleGroupsV1PostData > {
    api: FwmgrRequestApi;
    method: 'patchEntitiesRuleGroupsV1';
  }
 

 // types for postAggregatesEventsGetV1

 export type PostAggregatesEventsGetV1QueryParams = BaseUrlParams;

 export type PostAggregatesEventsGetV1ApiResponse = ApiResponsePayload<string>;

 export interface PostAggregatesEventsGetV1PostData {}

 export type PostAggregatesEventsGetV1ResponseMessage = BaseApiResponseMessage<PostAggregatesEventsGetV1ApiResponse>;

 
  export interface PostAggregatesEventsGetV1RequestMessage
    extends BaseApiRequestMessage<PostAggregatesEventsGetV1QueryParams,PostAggregatesEventsGetV1PostData > {
    api: FwmgrRequestApi;
    method: 'postAggregatesEventsGetV1';
  }
 

 // types for postAggregatesPolicyRulesGetV1

 export type PostAggregatesPolicyRulesGetV1QueryParams = BaseUrlParams;

 export type PostAggregatesPolicyRulesGetV1ApiResponse = ApiResponsePayload<string>;

 export interface PostAggregatesPolicyRulesGetV1PostData {}

 export type PostAggregatesPolicyRulesGetV1ResponseMessage = BaseApiResponseMessage<PostAggregatesPolicyRulesGetV1ApiResponse>;

 
  export interface PostAggregatesPolicyRulesGetV1RequestMessage
    extends BaseApiRequestMessage<PostAggregatesPolicyRulesGetV1QueryParams,PostAggregatesPolicyRulesGetV1PostData > {
    api: FwmgrRequestApi;
    method: 'postAggregatesPolicyRulesGetV1';
  }
 

 // types for postAggregatesRuleGroupsGetV1

 export type PostAggregatesRuleGroupsGetV1QueryParams = BaseUrlParams;

 export type PostAggregatesRuleGroupsGetV1ApiResponse = ApiResponsePayload<string>;

 export interface PostAggregatesRuleGroupsGetV1PostData {}

 export type PostAggregatesRuleGroupsGetV1ResponseMessage = BaseApiResponseMessage<PostAggregatesRuleGroupsGetV1ApiResponse>;

 
  export interface PostAggregatesRuleGroupsGetV1RequestMessage
    extends BaseApiRequestMessage<PostAggregatesRuleGroupsGetV1QueryParams,PostAggregatesRuleGroupsGetV1PostData > {
    api: FwmgrRequestApi;
    method: 'postAggregatesRuleGroupsGetV1';
  }
 

 // types for postAggregatesRulesGetV1

 export type PostAggregatesRulesGetV1QueryParams = BaseUrlParams;

 export type PostAggregatesRulesGetV1ApiResponse = ApiResponsePayload<string>;

 export interface PostAggregatesRulesGetV1PostData {}

 export type PostAggregatesRulesGetV1ResponseMessage = BaseApiResponseMessage<PostAggregatesRulesGetV1ApiResponse>;

 
  export interface PostAggregatesRulesGetV1RequestMessage
    extends BaseApiRequestMessage<PostAggregatesRulesGetV1QueryParams,PostAggregatesRulesGetV1PostData > {
    api: FwmgrRequestApi;
    method: 'postAggregatesRulesGetV1';
  }
 

 // types for postEntitiesNetworkLocationsMetadataV1

 export type PostEntitiesNetworkLocationsMetadataV1QueryParams = BaseUrlParams;

 export type PostEntitiesNetworkLocationsMetadataV1ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesNetworkLocationsMetadataV1PostData {}

 export type PostEntitiesNetworkLocationsMetadataV1ResponseMessage = BaseApiResponseMessage<PostEntitiesNetworkLocationsMetadataV1ApiResponse>;

 
  export interface PostEntitiesNetworkLocationsMetadataV1RequestMessage
    extends BaseApiRequestMessage<PostEntitiesNetworkLocationsMetadataV1QueryParams,PostEntitiesNetworkLocationsMetadataV1PostData > {
    api: FwmgrRequestApi;
    method: 'postEntitiesNetworkLocationsMetadataV1';
  }
 

 // types for postEntitiesNetworkLocationsPrecedenceV1

 export type PostEntitiesNetworkLocationsPrecedenceV1QueryParams = BaseUrlParams;

 export type PostEntitiesNetworkLocationsPrecedenceV1ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesNetworkLocationsPrecedenceV1PostData {}

 export type PostEntitiesNetworkLocationsPrecedenceV1ResponseMessage = BaseApiResponseMessage<PostEntitiesNetworkLocationsPrecedenceV1ApiResponse>;

 
  export interface PostEntitiesNetworkLocationsPrecedenceV1RequestMessage
    extends BaseApiRequestMessage<PostEntitiesNetworkLocationsPrecedenceV1QueryParams,PostEntitiesNetworkLocationsPrecedenceV1PostData > {
    api: FwmgrRequestApi;
    method: 'postEntitiesNetworkLocationsPrecedenceV1';
  }
 

 // types for postEntitiesNetworkLocationsV1

 export interface PostEntitiesNetworkLocationsV1QueryParams extends BaseUrlParams {
  comment?: QueryParam;
  cloneId?: QueryParam;
  addFwRules?: QueryParam;
}

 export type PostEntitiesNetworkLocationsV1ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesNetworkLocationsV1PostData {}

 export type PostEntitiesNetworkLocationsV1ResponseMessage = BaseApiResponseMessage<PostEntitiesNetworkLocationsV1ApiResponse>;

 
  export interface PostEntitiesNetworkLocationsV1RequestMessage
    extends BaseApiRequestMessage<PostEntitiesNetworkLocationsV1QueryParams,PostEntitiesNetworkLocationsV1PostData > {
    api: FwmgrRequestApi;
    method: 'postEntitiesNetworkLocationsV1';
  }
 

 // types for postEntitiesOntologyV1

 export type PostEntitiesOntologyV1QueryParams = BaseUrlParams;

 export type PostEntitiesOntologyV1ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesOntologyV1PostData {}

 export type PostEntitiesOntologyV1ResponseMessage = BaseApiResponseMessage<PostEntitiesOntologyV1ApiResponse>;

 
  export interface PostEntitiesOntologyV1RequestMessage
    extends BaseApiRequestMessage<PostEntitiesOntologyV1QueryParams,PostEntitiesOntologyV1PostData > {
    api: FwmgrRequestApi;
    method: 'postEntitiesOntologyV1';
  }
 

 // types for postEntitiesRuleGroupsV1

 export interface PostEntitiesRuleGroupsV1QueryParams extends BaseUrlParams {
  cloneId?: QueryParam;
  library?: QueryParam;
}

 export type PostEntitiesRuleGroupsV1ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesRuleGroupsV1PostData {}

 export type PostEntitiesRuleGroupsV1ResponseMessage = BaseApiResponseMessage<PostEntitiesRuleGroupsV1ApiResponse>;

 
  export interface PostEntitiesRuleGroupsV1RequestMessage
    extends BaseApiRequestMessage<PostEntitiesRuleGroupsV1QueryParams,PostEntitiesRuleGroupsV1PostData > {
    api: FwmgrRequestApi;
    method: 'postEntitiesRuleGroupsV1';
  }
 

 // types for postEntitiesRulesValidateFilepathV1

 export type PostEntitiesRulesValidateFilepathV1QueryParams = BaseUrlParams;

 export type PostEntitiesRulesValidateFilepathV1ApiResponse = ApiResponsePayload<string>;

 export interface PostEntitiesRulesValidateFilepathV1PostData {}

 export type PostEntitiesRulesValidateFilepathV1ResponseMessage = BaseApiResponseMessage<PostEntitiesRulesValidateFilepathV1ApiResponse>;

 
  export interface PostEntitiesRulesValidateFilepathV1RequestMessage
    extends BaseApiRequestMessage<PostEntitiesRulesValidateFilepathV1QueryParams,PostEntitiesRulesValidateFilepathV1PostData > {
    api: FwmgrRequestApi;
    method: 'postEntitiesRulesValidateFilepathV1';
  }
 

 // types for putEntitiesNetworkLocationsV1

 export interface PutEntitiesNetworkLocationsV1QueryParams extends BaseUrlParams {
  comment?: QueryParam;
}

 export type PutEntitiesNetworkLocationsV1ApiResponse = ApiResponsePayload<string>;

 export interface PutEntitiesNetworkLocationsV1PostData {}

 export type PutEntitiesNetworkLocationsV1ResponseMessage = BaseApiResponseMessage<PutEntitiesNetworkLocationsV1ApiResponse>;

 
  export interface PutEntitiesNetworkLocationsV1RequestMessage
    extends BaseApiRequestMessage<PutEntitiesNetworkLocationsV1QueryParams,PutEntitiesNetworkLocationsV1PostData > {
    api: FwmgrRequestApi;
    method: 'putEntitiesNetworkLocationsV1';
  }
 

 // types for putEntitiesPoliciesV2

 export interface PutEntitiesPoliciesV2QueryParams extends BaseUrlParams {
  id?: QueryParam;
  cloneId?: QueryParam;
}

 export type PutEntitiesPoliciesV2ApiResponse = ApiResponsePayload<string>;

 export interface PutEntitiesPoliciesV2PostData {}

 export type PutEntitiesPoliciesV2ResponseMessage = BaseApiResponseMessage<PutEntitiesPoliciesV2ApiResponse>;

 
  export interface PutEntitiesPoliciesV2RequestMessage
    extends BaseApiRequestMessage<PutEntitiesPoliciesV2QueryParams,PutEntitiesPoliciesV2PostData > {
    api: FwmgrRequestApi;
    method: 'putEntitiesPoliciesV2';
  }
 

// general types

export type FwmgrApiRequestMessage =
  | DeleteEntitiesNetworkLocationsV1RequestMessage
  | DeleteEntitiesPoliciesV1RequestMessage
  | DeleteEntitiesRuleGroupsV1RequestMessage
  | GetEntitiesEventsV1RequestMessage
  | GetEntitiesFirewallFieldsV1RequestMessage
  | GetEntitiesNetworkLocationsDetailsV1RequestMessage
  | GetEntitiesNetworkLocationsV1RequestMessage
  | GetEntitiesPlatformsV1RequestMessage
  | GetEntitiesPoliciesV1RequestMessage
  | GetEntitiesRuleGroupsV1RequestMessage
  | GetEntitiesRulesV1RequestMessage
  | GetLibraryEntitiesRuleGroupsV1RequestMessage
  | GetLibraryQueriesRuleGroupsV1RequestMessage
  | GetQueriesEventsV1RequestMessage
  | GetQueriesFirewallFieldsV1RequestMessage
  | GetQueriesNetworkLocationsV1RequestMessage
  | GetQueriesPlatformsV1RequestMessage
  | GetQueriesPolicyRulesV1RequestMessage
  | GetQueriesRuleGroupsV1RequestMessage
  | GetQueriesRulesV1RequestMessage
  | PatchEntitiesNetworkLocationsV1RequestMessage
  | PatchEntitiesRuleGroupsV1RequestMessage
  | PostAggregatesEventsGetV1RequestMessage
  | PostAggregatesPolicyRulesGetV1RequestMessage
  | PostAggregatesRuleGroupsGetV1RequestMessage
  | PostAggregatesRulesGetV1RequestMessage
  | PostEntitiesNetworkLocationsMetadataV1RequestMessage
  | PostEntitiesNetworkLocationsPrecedenceV1RequestMessage
  | PostEntitiesNetworkLocationsV1RequestMessage
  | PostEntitiesOntologyV1RequestMessage
  | PostEntitiesRuleGroupsV1RequestMessage
  | PostEntitiesRulesValidateFilepathV1RequestMessage
  | PutEntitiesNetworkLocationsV1RequestMessage
  | PutEntitiesPoliciesV2RequestMessage;

export type FwmgrApiResponseMessage =
  | DeleteEntitiesNetworkLocationsV1ResponseMessage
  | DeleteEntitiesPoliciesV1ResponseMessage
  | DeleteEntitiesRuleGroupsV1ResponseMessage
  | GetEntitiesEventsV1ResponseMessage
  | GetEntitiesFirewallFieldsV1ResponseMessage
  | GetEntitiesNetworkLocationsDetailsV1ResponseMessage
  | GetEntitiesNetworkLocationsV1ResponseMessage
  | GetEntitiesPlatformsV1ResponseMessage
  | GetEntitiesPoliciesV1ResponseMessage
  | GetEntitiesRuleGroupsV1ResponseMessage
  | GetEntitiesRulesV1ResponseMessage
  | GetLibraryEntitiesRuleGroupsV1ResponseMessage
  | GetLibraryQueriesRuleGroupsV1ResponseMessage
  | GetQueriesEventsV1ResponseMessage
  | GetQueriesFirewallFieldsV1ResponseMessage
  | GetQueriesNetworkLocationsV1ResponseMessage
  | GetQueriesPlatformsV1ResponseMessage
  | GetQueriesPolicyRulesV1ResponseMessage
  | GetQueriesRuleGroupsV1ResponseMessage
  | GetQueriesRulesV1ResponseMessage
  | PatchEntitiesNetworkLocationsV1ResponseMessage
  | PatchEntitiesRuleGroupsV1ResponseMessage
  | PostAggregatesEventsGetV1ResponseMessage
  | PostAggregatesPolicyRulesGetV1ResponseMessage
  | PostAggregatesRuleGroupsGetV1ResponseMessage
  | PostAggregatesRulesGetV1ResponseMessage
  | PostEntitiesNetworkLocationsMetadataV1ResponseMessage
  | PostEntitiesNetworkLocationsPrecedenceV1ResponseMessage
  | PostEntitiesNetworkLocationsV1ResponseMessage
  | PostEntitiesOntologyV1ResponseMessage
  | PostEntitiesRuleGroupsV1ResponseMessage
  | PostEntitiesRulesValidateFilepathV1ResponseMessage
  | PutEntitiesNetworkLocationsV1ResponseMessage
  | PutEntitiesPoliciesV2ResponseMessage;