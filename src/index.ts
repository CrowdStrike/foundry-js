import FalconPublicApis from 'apis/public-api';

import { PLATFORM_EVENTS } from './apis/types';
import { getBridgeInstance } from './bridge';

interface ReadyEventData {
  payload: {
    name: 'Ready';
    origin: string;
  };
}

export default class FalconApi extends FalconPublicApis {
  constructor() {
    const bridge = getBridgeInstance();

    const handleReadyEvent = (data: ReadyEventData) => {
      if (data.payload.name === PLATFORM_EVENTS.READY) {
        this.bridge.message.off(handleReadyEvent);

        this.bridge.setOrigin(data.payload?.origin);
        this.bridge.postMessage({ type: PLATFORM_EVENTS.READY });
      }
    };

    bridge.message.on(handleReadyEvent);

    super(bridge);
  }
}
