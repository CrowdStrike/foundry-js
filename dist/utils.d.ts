import FalconApi from 'api';
import type { LocalData, MessageEnvelope, ResponseMessage } from './types';
export declare function assertConnection<DATA extends LocalData>(falcon: FalconApi<DATA>): void;
export declare function isValidResponse<DATA extends LocalData>(event: MessageEvent<MessageEnvelope<ResponseMessage<DATA>> | any>): event is MessageEvent<MessageEnvelope<ResponseMessage<DATA>>>;
