import FalconPublicApis from './apis/public-api';

import { PLATFORM_EVENTS } from './apis/types';

export default class FalconApi extends FalconPublicApis {
  async connect(): Promise<void> {
    const data: any = await this.bridge.postMessage({
      type: PLATFORM_EVENTS.READY,
    });

    this.bridge.setOrigin(data.origin);
    this.isConnected = true;
  }

  destroy() {
    this.bridge.destroy();
  }
}
