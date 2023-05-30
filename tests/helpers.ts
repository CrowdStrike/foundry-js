import {
  ConnectRequestMessage,
  ConnectResponseMessage,
  LocalData,
  MessageEnvelope,
} from 'types';
import FalconApi from '../src';

export async function connectApi(api: FalconApi, data?: LocalData) {
  // simulate ready answer coming back from main thread
  window.parent.addEventListener(
    'message',
    (message: MessageEvent<MessageEnvelope<ConnectRequestMessage>>) => {
      const { meta } = message.data;
      const response: MessageEnvelope<ConnectResponseMessage> = {
        message: { type: 'connect', payload: { origin: '', data } },
        meta,
      };
      window.postMessage(response);
    }
  );

  return api.connect();
}

export const uuidV4Regex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
