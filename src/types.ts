import type { ApiIdentifier } from './apis/available-apis';

export type QueryParam = string | number | string[] | number[] | boolean;

export interface BaseUrlParams {
  [key: string]: QueryParam | undefined;
}

export type LocalData = unknown;

export type MessageType = 'connect' | 'api' | 'data';

export interface BaseMessage {
  type: MessageType;
  payload?: unknown;
}

export interface ConnectRequestMessage extends BaseMessage {
  type: 'connect';
}

export interface ConnectResponseMessage<DATA extends LocalData = LocalData>
  extends BaseMessage {
  type: 'connect';
  payload: {
    origin: string;
    data?: DATA;
  };
}

export interface DataUpdateMessage<DATA extends LocalData = LocalData>
  extends BaseMessage {
  type: 'data';
  payload: DATA;
}

export interface ApiRequestGetPayload<
  PARAMS extends BaseUrlParams = BaseUrlParams
> {
  params: PARAMS;
}

export interface ApiRequestPostPayload<
  PARAMS extends BaseUrlParams = BaseUrlParams,
  BODY = unknown
> {
  body: BODY;
  params: PARAMS;
}

type ApiRequestPayload<
  PARAMS extends BaseUrlParams = BaseUrlParams,
  BODY = undefined
> = BODY extends undefined
  ? ApiRequestGetPayload<PARAMS>
  : ApiRequestPostPayload<PARAMS, BODY>;

export interface ApiResponseError {
  code?: number;
  id?: string;
  message: string;
}

export interface ApiResponsePayload<T = unknown> {
  resources?: T[];
  errors?: ApiResponseError[];
}

export interface BaseApiRequestMessage<
  PARAMS extends BaseUrlParams = BaseUrlParams,
  BODY = undefined
> extends BaseMessage {
  type: 'api';
  api: ApiIdentifier;
  method: string;
  payload: ApiRequestPayload<PARAMS, BODY>;
}

export interface BaseApiResponseMessage<T = unknown> extends BaseMessage {
  type: 'api';
  payload: T;
}

export interface MessageMetadata {
  messageId: string;
  version?: string;
}

export interface MessageEnvelope<M> {
  message: M;
  meta: MessageMetadata;
}

export { ApiIdentifier };

export { PayloadOf,  RequestMessage, ResponseMessage } from './apis/types'
export { ResponseFor } from './apis/types-response-for'