import FalconPublicApis from './apis/public-api';

export default class FalconApi extends FalconPublicApis {
  async connect(): Promise<void> {
    const { origin } = await this.bridge.postMessage({ type: 'connect' });

    this.bridge.setOrigin(origin);
    this.isConnected = true;
  }

  destroy() {
    this.bridge.destroy();
  }
}
