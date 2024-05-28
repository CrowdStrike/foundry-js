import type FalconApi from '../src';
import type {
  ConnectRequestMessage,
  ConnectResponseMessage,
  LocalData,
  MessageEnvelope,
} from '../src/types';

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
    },
    { once: true },
  );

  return api.connect();
}

export async function nextTick() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

export const uuidV4Regex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
