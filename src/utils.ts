import type FalconPublicApis from './apis/public-api';
import type { LocalData, MessageEnvelope, ResponseMessage } from './types';

export function assertConnection(falcon: FalconPublicApis) {
  if (!falcon.isConnected) {
    throw new Error(
      'You cannot call this API before having established a connection to the host!',
    );
  }
}

export function isValidResponse<DATA extends LocalData>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: MessageEvent<MessageEnvelope<ResponseMessage<DATA>> | any>,
): event is MessageEvent<MessageEnvelope<ResponseMessage<DATA>>> {
  return !!event?.data?.meta?.messageId;
}
