/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
import type { RequestMessage } from '../types';
import type { DeleteEntitiesSuppressedDevicesV1RequestMessage as Request00, GetQueriesAlertsV1RequestMessage as Request01, PostEntitiesAlertsV1RequestMessage as Request010, PostEntitiesAlertsV2RequestMessage as Request011, PostEntitiesSuppressedDevicesV1RequestMessage as Request012, GetQueriesAlertsV2RequestMessage as Request02, PatchCombinedAlertsV2RequestMessage as Request03, PatchCombinedAlertsV3RequestMessage as Request04, PatchEntitiesAlertsV2RequestMessage as Request05, PatchEntitiesAlertsV3RequestMessage as Request06, PatchEntitiesSuppressedDevicesV1RequestMessage as Request07, PostAggregatesAlertsV1RequestMessage as Request08, PostAggregatesAlertsV2RequestMessage as Request09, DeleteEntitiesSuppressedDevicesV1ResponseMessage as Response00, GetQueriesAlertsV1ResponseMessage as Response01, PostEntitiesAlertsV1ResponseMessage as Response010, PostEntitiesAlertsV2ResponseMessage as Response011, PostEntitiesSuppressedDevicesV1ResponseMessage as Response012, GetQueriesAlertsV2ResponseMessage as Response02, PatchCombinedAlertsV2ResponseMessage as Response03, PatchCombinedAlertsV3ResponseMessage as Response04, PatchEntitiesAlertsV2ResponseMessage as Response05, PatchEntitiesAlertsV3ResponseMessage as Response06, PatchEntitiesSuppressedDevicesV1ResponseMessage as Response07, PostAggregatesAlertsV1ResponseMessage as Response08, PostAggregatesAlertsV2ResponseMessage as Response09 } from './alerts';
import type { GetEntitiesSuppressedDevicesV1RequestMessage as Request10, PatchEntitiesDetectsV2RequestMessage as Request11, PatchQueriesDetectsV1RequestMessage as Request12, PatchQueriesDetectsV2RequestMessage as Request13, PostAggregatesDetectsGetV1RequestMessage as Request14, PostEntitiesSummariesGetV1RequestMessage as Request15, PostEntitiesSuppressedDevicesV1RequestMessage as Request16, GetEntitiesSuppressedDevicesV1ResponseMessage as Response10, PatchEntitiesDetectsV2ResponseMessage as Response11, PatchQueriesDetectsV1ResponseMessage as Response12, PatchQueriesDetectsV2ResponseMessage as Response13, PostAggregatesDetectsGetV1ResponseMessage as Response14, PostEntitiesSummariesGetV1ResponseMessage as Response15, PostEntitiesSuppressedDevicesV1ResponseMessage as Response16 } from './detects';
import type { DeleteEntitiesGroupsV1RequestMessage as Request20, GetAggregatesBucketsV1RequestMessage as Request21, GetQueriesFgaGroupsV1RequestMessage as Request210, GetQueriesGroupsV1RequestMessage as Request211, PatchEntitiesDevicesTagsV2RequestMessage as Request212, PatchEntitiesGroupsV1RequestMessage as Request213, PostAggregatesDevicesGetV1RequestMessage as Request214, PostAggregatesFgaHostsGetV1RequestMessage as Request215, PostCombinedDevicesLoginHistoryV1RequestMessage as Request216, PostCombinedFgaHostsLoginHistoryV1RequestMessage as Request217, PostEntitiesDevicesActionsV4RequestMessage as Request218, PostEntitiesDevicesHiddenActionsV4RequestMessage as Request219, GetAggregatesFgaTagPrefixCountsV1RequestMessage as Request22, PostEntitiesDevicesReportsV1RequestMessage as Request220, PostEntitiesDevicesV2RequestMessage as Request221, PostEntitiesFgaHostsReportsV1RequestMessage as Request222, PostEntitiesFgaHostsV1RequestMessage as Request223, PostEntitiesGroupActionsV1RequestMessage as Request224, PostEntitiesGroupsV1RequestMessage as Request225, GetAggregatesTagPrefixCountsV1RequestMessage as Request23, GetEntitiesFgaGroupsV1RequestMessage as Request24, GetEntitiesGroupsV1RequestMessage as Request25, GetQueriesAvailableGroupsV1RequestMessage as Request26, GetQueriesDevicesHiddenV2RequestMessage as Request27, GetQueriesDevicesV1RequestMessage as Request28, GetQueriesDevicesV2RequestMessage as Request29, DeleteEntitiesGroupsV1ResponseMessage as Response20, GetAggregatesBucketsV1ResponseMessage as Response21, GetQueriesFgaGroupsV1ResponseMessage as Response210, GetQueriesGroupsV1ResponseMessage as Response211, PatchEntitiesDevicesTagsV2ResponseMessage as Response212, PatchEntitiesGroupsV1ResponseMessage as Response213, PostAggregatesDevicesGetV1ResponseMessage as Response214, PostAggregatesFgaHostsGetV1ResponseMessage as Response215, PostCombinedDevicesLoginHistoryV1ResponseMessage as Response216, PostCombinedFgaHostsLoginHistoryV1ResponseMessage as Response217, PostEntitiesDevicesActionsV4ResponseMessage as Response218, PostEntitiesDevicesHiddenActionsV4ResponseMessage as Response219, GetAggregatesFgaTagPrefixCountsV1ResponseMessage as Response22, PostEntitiesDevicesReportsV1ResponseMessage as Response220, PostEntitiesDevicesV2ResponseMessage as Response221, PostEntitiesFgaHostsReportsV1ResponseMessage as Response222, PostEntitiesFgaHostsV1ResponseMessage as Response223, PostEntitiesGroupActionsV1ResponseMessage as Response224, PostEntitiesGroupsV1ResponseMessage as Response225, GetAggregatesTagPrefixCountsV1ResponseMessage as Response23, GetEntitiesFgaGroupsV1ResponseMessage as Response24, GetEntitiesGroupsV1ResponseMessage as Response25, GetQueriesAvailableGroupsV1ResponseMessage as Response26, GetQueriesDevicesHiddenV2ResponseMessage as Response27, GetQueriesDevicesV1ResponseMessage as Response28, GetQueriesDevicesV2ResponseMessage as Response29 } from './devices';
import type { DeleteEntitiesNetworkLocationsV1RequestMessage as Request30, DeleteEntitiesPoliciesV1RequestMessage as Request31, GetEntitiesRulesV1RequestMessage as Request310, GetLibraryEntitiesRuleGroupsV1RequestMessage as Request311, GetLibraryQueriesRuleGroupsV1RequestMessage as Request312, GetQueriesEventsV1RequestMessage as Request313, GetQueriesFirewallFieldsV1RequestMessage as Request314, GetQueriesNetworkLocationsV1RequestMessage as Request315, GetQueriesPlatformsV1RequestMessage as Request316, GetQueriesPolicyRulesV1RequestMessage as Request317, GetQueriesRuleGroupsV1RequestMessage as Request318, GetQueriesRulesV1RequestMessage as Request319, DeleteEntitiesRuleGroupsV1RequestMessage as Request32, PatchEntitiesNetworkLocationsV1RequestMessage as Request320, PatchEntitiesRuleGroupsV1RequestMessage as Request321, PostAggregatesEventsGetV1RequestMessage as Request322, PostAggregatesPolicyRulesGetV1RequestMessage as Request323, PostAggregatesRuleGroupsGetV1RequestMessage as Request324, PostAggregatesRulesGetV1RequestMessage as Request325, PostEntitiesNetworkLocationsMetadataV1RequestMessage as Request326, PostEntitiesNetworkLocationsPrecedenceV1RequestMessage as Request327, PostEntitiesNetworkLocationsV1RequestMessage as Request328, PostEntitiesOntologyV1RequestMessage as Request329, GetEntitiesEventsV1RequestMessage as Request33, PostEntitiesRuleGroupsV1RequestMessage as Request330, PostEntitiesRulesValidateFilepathV1RequestMessage as Request331, PutEntitiesNetworkLocationsV1RequestMessage as Request332, PutEntitiesPoliciesV2RequestMessage as Request333, GetEntitiesFirewallFieldsV1RequestMessage as Request34, GetEntitiesNetworkLocationsDetailsV1RequestMessage as Request35, GetEntitiesNetworkLocationsV1RequestMessage as Request36, GetEntitiesPlatformsV1RequestMessage as Request37, GetEntitiesPoliciesV1RequestMessage as Request38, GetEntitiesRuleGroupsV1RequestMessage as Request39, DeleteEntitiesNetworkLocationsV1ResponseMessage as Response30, DeleteEntitiesPoliciesV1ResponseMessage as Response31, GetEntitiesRulesV1ResponseMessage as Response310, GetLibraryEntitiesRuleGroupsV1ResponseMessage as Response311, GetLibraryQueriesRuleGroupsV1ResponseMessage as Response312, GetQueriesEventsV1ResponseMessage as Response313, GetQueriesFirewallFieldsV1ResponseMessage as Response314, GetQueriesNetworkLocationsV1ResponseMessage as Response315, GetQueriesPlatformsV1ResponseMessage as Response316, GetQueriesPolicyRulesV1ResponseMessage as Response317, GetQueriesRuleGroupsV1ResponseMessage as Response318, GetQueriesRulesV1ResponseMessage as Response319, DeleteEntitiesRuleGroupsV1ResponseMessage as Response32, PatchEntitiesNetworkLocationsV1ResponseMessage as Response320, PatchEntitiesRuleGroupsV1ResponseMessage as Response321, PostAggregatesEventsGetV1ResponseMessage as Response322, PostAggregatesPolicyRulesGetV1ResponseMessage as Response323, PostAggregatesRuleGroupsGetV1ResponseMessage as Response324, PostAggregatesRulesGetV1ResponseMessage as Response325, PostEntitiesNetworkLocationsMetadataV1ResponseMessage as Response326, PostEntitiesNetworkLocationsPrecedenceV1ResponseMessage as Response327, PostEntitiesNetworkLocationsV1ResponseMessage as Response328, PostEntitiesOntologyV1ResponseMessage as Response329, GetEntitiesEventsV1ResponseMessage as Response33, PostEntitiesRuleGroupsV1ResponseMessage as Response330, PostEntitiesRulesValidateFilepathV1ResponseMessage as Response331, PutEntitiesNetworkLocationsV1ResponseMessage as Response332, PutEntitiesPoliciesV2ResponseMessage as Response333, GetEntitiesFirewallFieldsV1ResponseMessage as Response34, GetEntitiesNetworkLocationsDetailsV1ResponseMessage as Response35, GetEntitiesNetworkLocationsV1ResponseMessage as Response36, GetEntitiesPlatformsV1ResponseMessage as Response37, GetEntitiesPoliciesV1ResponseMessage as Response38, GetEntitiesRuleGroupsV1ResponseMessage as Response39 } from './fwmgr';
import type { GetCombinedCrowdscoresV1RequestMessage as Request40, GetQueriesBehaviorsV1RequestMessage as Request41, GetQueriesIncidentsV1RequestMessage as Request42, PostAggregatesBehaviorsGetV1RequestMessage as Request43, PostAggregatesIncidentsGetV1RequestMessage as Request44, PostEntitiesBehaviorsGetV1RequestMessage as Request45, PostEntitiesIncidentActionsV1RequestMessage as Request46, PostEntitiesIncidentsGetV1RequestMessage as Request47, GetCombinedCrowdscoresV1ResponseMessage as Response40, GetQueriesBehaviorsV1ResponseMessage as Response41, GetQueriesIncidentsV1ResponseMessage as Response42, PostAggregatesBehaviorsGetV1ResponseMessage as Response43, PostAggregatesIncidentsGetV1ResponseMessage as Response44, PostEntitiesBehaviorsGetV1ResponseMessage as Response45, PostEntitiesIncidentActionsV1ResponseMessage as Response46, PostEntitiesIncidentsGetV1ResponseMessage as Response47 } from './incidents';
import type { GetIntelMitreEntitiesMatrixV1RequestMessage as Request50, GetIntelMitreEntitiesMatrixV1ResponseMessage as Response50 } from './mitre';
import type { GetEntitiesConfigsV1RequestMessage as Request60, PostEntitiesExecuteDraftV1RequestMessage as Request61, PostEntitiesExecuteV1RequestMessage as Request62, GetEntitiesDefinitionsV1RequestMessage as Request63, GetEntitiesConfigsV1ResponseMessage as Response60, PostEntitiesExecuteDraftV1ResponseMessage as Response61, PostEntitiesExecuteV1ResponseMessage as Response62, GetEntitiesDefinitionsV1ResponseMessage as Response63 } from './plugins';
import type { DeleteEntitiesPutFilesV1RequestMessage as Request70, GetEntitiesAppCommandV1RequestMessage as Request71, GetEntitiesPutFilesV2RequestMessage as Request72, GetQueriesPutFilesV1RequestMessage as Request73, PostEntitiesAppCommandV1RequestMessage as Request74, PostEntitiesAppSessionsV1RequestMessage as Request75, DeleteEntitiesPutFilesV1ResponseMessage as Response70, GetEntitiesAppCommandV1ResponseMessage as Response71, GetEntitiesPutFilesV2ResponseMessage as Response72, GetQueriesPutFilesV1ResponseMessage as Response73, PostEntitiesAppCommandV1ResponseMessage as Response74, PostEntitiesAppSessionsV1ResponseMessage as Response75 } from './remote-response';
import type { GetQueriesUsersV1RequestMessage as Request80, PostEntitiesUsersGetV1RequestMessage as Request81, GetQueriesUsersV1ResponseMessage as Response80, PostEntitiesUsersGetV1ResponseMessage as Response81 } from './user-management';
import type { GetEntitiesExecutionResultsV1RequestMessage as Request90, PostEntitiesExecuteV1RequestMessage as Request91, PostEntitiesExecutionActionsV1RequestMessage as Request92, GetEntitiesExecutionResultsV1ResponseMessage as Response90, PostEntitiesExecuteV1ResponseMessage as Response91, PostEntitiesExecutionActionsV1ResponseMessage as Response92 } from './workflows';
import type { DeleteV1CollectionsCollectionNameObjectsObjectKeyRequestMessage as Request100, GetV1CollectionsRequestMessage as Request101, GetV1CollectionsCollectionNameObjectsRequestMessage as Request102, GetV1CollectionsCollectionNameObjectsObjectKeyRequestMessage as Request103, GetV1CollectionsCollectionNameObjectsObjectKeyMetadataRequestMessage as Request104, PostV1CollectionsCollectionNameObjectsRequestMessage as Request105, PutV1CollectionsCollectionNameObjectsObjectKeyRequestMessage as Request106, DeleteV1CollectionsCollectionNameObjectsObjectKeyResponseMessage as Response100, GetV1CollectionsResponseMessage as Response101, GetV1CollectionsCollectionNameObjectsResponseMessage as Response102, GetV1CollectionsCollectionNameObjectsObjectKeyResponseMessage as Response103, GetV1CollectionsCollectionNameObjectsObjectKeyMetadataResponseMessage as Response104, PostV1CollectionsCollectionNameObjectsResponseMessage as Response105, PutV1CollectionsCollectionNameObjectsObjectKeyResponseMessage as Response106 } from './customobjects';
import type { GetEntitiesExecutionV1RequestMessage as Request110, PostEntitiesExecutionV1RequestMessage as Request111, GetEntitiesExecutionV1ResponseMessage as Response110, PostEntitiesExecutionV1ResponseMessage as Response111 } from './faas-gateway';
import type { GetEntitiesSavedSearchesExecuteV1RequestMessage as Request120, PostEntitiesSavedSearchesExecuteV1RequestMessage as Request121, GetEntitiesSavedSearchesV1RequestMessage as Request122, GetEntitiesSavedSearchesExecuteV1ResponseMessage as Response120, PostEntitiesSavedSearchesExecuteV1ResponseMessage as Response121, GetEntitiesSavedSearchesV1ResponseMessage as Response122 } from './loggingapi';
export type ResponseFor<REQ extends RequestMessage> = REQ extends Request00 ? Response00 : REQ extends Request01 ? Response01 : REQ extends Request02 ? Response02 : REQ extends Request03 ? Response03 : REQ extends Request04 ? Response04 : REQ extends Request05 ? Response05 : REQ extends Request06 ? Response06 : REQ extends Request07 ? Response07 : REQ extends Request08 ? Response08 : REQ extends Request09 ? Response09 : REQ extends Request010 ? Response010 : REQ extends Request011 ? Response011 : REQ extends Request012 ? Response012 : REQ extends Request10 ? Response10 : REQ extends Request11 ? Response11 : REQ extends Request12 ? Response12 : REQ extends Request13 ? Response13 : REQ extends Request14 ? Response14 : REQ extends Request15 ? Response15 : REQ extends Request16 ? Response16 : REQ extends Request20 ? Response20 : REQ extends Request21 ? Response21 : REQ extends Request22 ? Response22 : REQ extends Request23 ? Response23 : REQ extends Request24 ? Response24 : REQ extends Request25 ? Response25 : REQ extends Request26 ? Response26 : REQ extends Request27 ? Response27 : REQ extends Request28 ? Response28 : REQ extends Request29 ? Response29 : REQ extends Request210 ? Response210 : REQ extends Request211 ? Response211 : REQ extends Request212 ? Response212 : REQ extends Request213 ? Response213 : REQ extends Request214 ? Response214 : REQ extends Request215 ? Response215 : REQ extends Request216 ? Response216 : REQ extends Request217 ? Response217 : REQ extends Request218 ? Response218 : REQ extends Request219 ? Response219 : REQ extends Request220 ? Response220 : REQ extends Request221 ? Response221 : REQ extends Request222 ? Response222 : REQ extends Request223 ? Response223 : REQ extends Request224 ? Response224 : REQ extends Request225 ? Response225 : REQ extends Request30 ? Response30 : REQ extends Request31 ? Response31 : REQ extends Request32 ? Response32 : REQ extends Request33 ? Response33 : REQ extends Request34 ? Response34 : REQ extends Request35 ? Response35 : REQ extends Request36 ? Response36 : REQ extends Request37 ? Response37 : REQ extends Request38 ? Response38 : REQ extends Request39 ? Response39 : REQ extends Request310 ? Response310 : REQ extends Request311 ? Response311 : REQ extends Request312 ? Response312 : REQ extends Request313 ? Response313 : REQ extends Request314 ? Response314 : REQ extends Request315 ? Response315 : REQ extends Request316 ? Response316 : REQ extends Request317 ? Response317 : REQ extends Request318 ? Response318 : REQ extends Request319 ? Response319 : REQ extends Request320 ? Response320 : REQ extends Request321 ? Response321 : REQ extends Request322 ? Response322 : REQ extends Request323 ? Response323 : REQ extends Request324 ? Response324 : REQ extends Request325 ? Response325 : REQ extends Request326 ? Response326 : REQ extends Request327 ? Response327 : REQ extends Request328 ? Response328 : REQ extends Request329 ? Response329 : REQ extends Request330 ? Response330 : REQ extends Request331 ? Response331 : REQ extends Request332 ? Response332 : REQ extends Request333 ? Response333 : REQ extends Request40 ? Response40 : REQ extends Request41 ? Response41 : REQ extends Request42 ? Response42 : REQ extends Request43 ? Response43 : REQ extends Request44 ? Response44 : REQ extends Request45 ? Response45 : REQ extends Request46 ? Response46 : REQ extends Request47 ? Response47 : REQ extends Request50 ? Response50 : REQ extends Request60 ? Response60 : REQ extends Request61 ? Response61 : REQ extends Request62 ? Response62 : REQ extends Request63 ? Response63 : REQ extends Request70 ? Response70 : REQ extends Request71 ? Response71 : REQ extends Request72 ? Response72 : REQ extends Request73 ? Response73 : REQ extends Request74 ? Response74 : REQ extends Request75 ? Response75 : REQ extends Request80 ? Response80 : REQ extends Request81 ? Response81 : REQ extends Request90 ? Response90 : REQ extends Request91 ? Response91 : REQ extends Request92 ? Response92 : REQ extends Request100 ? Response100 : REQ extends Request101 ? Response101 : REQ extends Request102 ? Response102 : REQ extends Request103 ? Response103 : REQ extends Request104 ? Response104 : REQ extends Request105 ? Response105 : REQ extends Request106 ? Response106 : REQ extends Request110 ? Response110 : REQ extends Request111 ? Response111 : REQ extends Request120 ? Response120 : REQ extends Request121 ? Response121 : REQ extends Request122 ? Response122 : any;
