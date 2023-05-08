import FalconApi from '../src';
import { PLATFORM_EVENTS } from '../src/apis/types';

export async function connectApi(api: FalconApi) {
  const promise = api.connect();

  // simulate ready event coming from main thread
  window.postMessage({ payload: { name: PLATFORM_EVENTS.READY } });

  await promise;
}

export const uuidV4Regex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
