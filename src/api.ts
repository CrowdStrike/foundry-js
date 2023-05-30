import { DataUpdateMessage, LocalData } from 'types';
import FalconPublicApis from './apis/public-api';
import Emittery from 'emittery';
import { Bridge } from './bridge';

// This taps maps event names to the event shape, used by emittery. Extends this when adding new subscribable events
interface EventMap<DATA extends LocalData> {
  data: DATA;
}

export default class FalconApi<
  DATA extends LocalData = LocalData
> extends FalconPublicApis {
  public events = new Emittery<EventMap<DATA>>();
  public data?: DATA;
  public bridge: Bridge<DATA> = new Bridge<DATA>({
    onDataUpdate: (data) => this.handleDataUpdate(data),
  });

  async connect(): Promise<void> {
    const { origin, data } = await this.bridge.postMessage({ type: 'connect' });

    this.bridge.setOrigin(origin);
    this.data = data;

    this.isConnected = true;
  }

  private handleDataUpdate(dataMessage: DataUpdateMessage<DATA>): void {
    this.data = dataMessage.payload;
    this.events.emit('data', this.data);
  }

  destroy() {
    this.bridge.destroy();
  }
}
