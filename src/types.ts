import type { ApiIdentifier } from './apis/available-apis';
import {
  GetQueriesIncidentsV1RequestMessage,
  GetQueriesIncidentsV1ResponseMessage,
  IncidentsApiRequestMessage,
  IncidentsApiResponseMessage,
  PostEntitiesIncidentsGetV1RequestMessage,
  PostEntitiesIncidentsGetV1ResponseMessage,
} from './apis/incidents/types';
import {
  GetQueriesScriptsV1RequestMessage,
  GetQueriesScriptsV1ResponseMessage,
  PostEntitiesScriptsGetV2RequestMessage,
  PostEntitiesScriptsGetV2ResponseMessage,
  RemoteResponseApiRequestMessage,
  RemoteResponseApiResponseMessage,
} from './apis/remote-response/types';

export type QueryParam = string | number | string[] | number[] | boolean;

export interface BaseUrlParams {
  [key: string]: QueryParam | undefined;
}

export type MessageType = 'connect' | 'api';

export interface BaseMessage {
  type: MessageType;
  payload?: unknown;
}

export interface ConnectRequestMessage extends BaseMessage {
  type: 'connect';
}

export interface ConnectResponseMessage extends BaseMessage {
  type: 'connect';
  payload: {
    origin: string;
  };
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

export type ApiRequestMessage =
  | IncidentsApiRequestMessage
  | RemoteResponseApiRequestMessage;

export type RequestMessage = ConnectRequestMessage | ApiRequestMessage;

export type ApiResponseMessage =
  | IncidentsApiResponseMessage
  | RemoteResponseApiResponseMessage;

export type ResponseMessage = ConnectResponseMessage | ApiResponseMessage;

export interface MessageMetadata {
  messageId: string;
  version?: string;
}

export interface MessageEnvelope<M> {
  message: M;
  meta: MessageMetadata;
}

// @todo can we make this less explicit?
export type ResponseFor<REQ extends RequestMessage> =
  REQ extends ConnectRequestMessage
    ? ConnectResponseMessage
    : REQ extends GetQueriesIncidentsV1RequestMessage
    ? GetQueriesIncidentsV1ResponseMessage
    : REQ extends PostEntitiesIncidentsGetV1RequestMessage
    ? PostEntitiesIncidentsGetV1ResponseMessage
    : REQ extends GetQueriesScriptsV1RequestMessage
    ? GetQueriesScriptsV1ResponseMessage
    : REQ extends PostEntitiesScriptsGetV2RequestMessage
    ? PostEntitiesScriptsGetV2ResponseMessage
    : unknown;

export type PayloadOf<RESPONSE extends ResponseMessage> = RESPONSE['payload'];

export { ApiIdentifier };
