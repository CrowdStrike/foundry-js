import FalconPublicApis from './apis/public-api';

import { PLATFORM_EVENTS } from './apis/types';

interface ReadyEventData {
  payload: {
    name: 'Ready';
    origin: string;
  };
}

const CONNECTION_TIMEOUT = process.env.VITEST ? 1 : 5000;

export default class FalconApi extends FalconPublicApis {
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

  destroy() {
    this.bridge.destroy();
  }
}
