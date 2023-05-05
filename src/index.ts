import FalconPublicApis from 'apis/public-api';

import { PLATFORM_EVENTS } from './apis/types';
import { getBridgeInstance } from './bridge';

interface ReadyEventData {
  payload: {
    name: 'Ready';
    origin: string;
  };
}

const CONNECTION_TIMEOUT = 5000;

export default class FalconApi extends FalconPublicApis {
  bridge = getBridgeInstance();

  async connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const timeoutTimer = setTimeout(() => {
        this.bridge.message.off(handleReadyEvent);
        reject(
          new Error(
            `Connection to foundry host timed out after ${CONNECTION_TIMEOUT}ms!`
          )
        );
      }, CONNECTION_TIMEOUT);

      const handleReadyEvent = (data: ReadyEventData) => {
        if (data.payload.name === PLATFORM_EVENTS.READY) {
          this.bridge.message.off(handleReadyEvent);
          clearTimeout(timeoutTimer);

          this.bridge.setOrigin(data.payload?.origin);
          this.bridge.postMessage({ type: PLATFORM_EVENTS.READY });

          this.isConnected = true;

          resolve();
        }
      };

      this.bridge.message.on(handleReadyEvent);
    });
  }
}
