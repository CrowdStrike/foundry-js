/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/

import type { Bridge } from '../../bridge';

import type {
  ApiResponsePayload,
  BaseApiRequestMessage,
  BaseApiResponseMessage,
  BaseUrlParams,
} from '../../types';

export type RegistryAssessmentRequestApi = 'registryAssessment';

export type CommonApiResponseMessage =
  BaseApiResponseMessage<ApiResponsePayload>;

export interface CommonApiRequestMessage
  extends BaseApiRequestMessage<BaseUrlParams, unknown> {
  api: RegistryAssessmentRequestApi;
}

// types for getAggregatesRegistriesCountByStateV1

export type GetAggregatesRegistriesCountByStateV1QueryParams = BaseUrlParams;

export type GetAggregatesRegistriesCountByStateV1ApiResponse =
  ApiResponsePayload;

export type GetAggregatesRegistriesCountByStateV1ResponseMessage =
  BaseApiResponseMessage<GetAggregatesRegistriesCountByStateV1ApiResponse>;

export interface GetAggregatesRegistriesCountByStateV1RequestMessage
  extends BaseApiRequestMessage<GetAggregatesRegistriesCountByStateV1QueryParams> {
  api: RegistryAssessmentRequestApi;
  method: 'getAggregatesRegistriesCountByStateV1';
}

// general types

export type RegistryAssessmentApiRequestMessage =
  GetAggregatesRegistriesCountByStateV1RequestMessage;

export type RegistryAssessmentApiResponseMessage =
  GetAggregatesRegistriesCountByStateV1ResponseMessage;

export class RegistryAssessmentApiBridge {
  private bridge;

  constructor(bridge: Bridge) {
    this.bridge = bridge;
  }

  getBridge() {
    return this.bridge;
  }

  async getAggregatesRegistriesCountByStateV1(
    urlParams: GetAggregatesRegistriesCountByStateV1QueryParams = {},
  ): Promise<GetAggregatesRegistriesCountByStateV1ApiResponse> {
    const message: GetAggregatesRegistriesCountByStateV1RequestMessage = {
      type: 'api',
      api: 'registryAssessment',
      method: 'getAggregatesRegistriesCountByStateV1',
      payload: {
        params: urlParams,
      },
    };

    return this.bridge.postMessage(message);
  }
}
