import type { RequestApi } from './apis/available-apis';

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

export interface ApiRequestMessage extends BaseMessage {
  type: 'api';
  api: RequestApi;
  method: string;
  payload: unknown;
}

export interface ApiResponseMessage extends BaseMessage {
  payload: unknown;
  type: 'api';
}

export type RequestMessage = ConnectRequestMessage | ApiRequestMessage;
export type ResponseMessage = ConnectResponseMessage | ApiResponseMessage;

export interface MessageMetadata {
  messageId: string;
  version: string;
}

export interface MessageEnvelope<M> {
  message: M;
  meta: MessageMetadata;
}

export type ResponseFor<REQ extends RequestMessage> =
  REQ extends ConnectRequestMessage
    ? ConnectResponseMessage
    : REQ extends ApiRequestMessage
    ? ApiResponseMessage
    : never;

export type PayloadOf<RESPONSE extends ResponseMessage> = RESPONSE['payload'];
