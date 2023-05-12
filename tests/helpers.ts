import FalconApi from '../src';
import { PLATFORM_EVENTS } from '../src/apis/types';

export async function connectApi(api: FalconApi) {
  // simulate ready answer coming back from main thread
  window.parent.addEventListener('message', (message) => {
    window.postMessage({
      payload: { name: PLATFORM_EVENTS },
      meta: { __csMessageId__: message.data.meta.__csMessageId__ },
    });
  });

  return api.connect();
}

export const uuidV4Regex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
