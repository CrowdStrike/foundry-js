import Emittery from 'emittery';
import FalconPublicApis from './apis/public-api';
import { ApiIntegration } from './abstraction/api-integration';
import { Bridge } from './bridge';
import { CloudFunction } from './abstraction/cloud-function';
import { Collection } from './abstraction/collection';
import { Logscale } from './abstraction/logscale';
import { Memoize } from 'typescript-memoize';
import { Navigation } from './lib/navigation';
import { ResizeTracker } from './lib/resize-tracker';
import { UI } from './lib/ui';
import { assertConnection } from './utils';
import type {
  BroadcastMessage,
  CloudFunctionDefinition,
  DataUpdateMessage,
  FileUploadType,
  LocalData,
  PayloadForFileUploadType,
  ResponseForFileUploadType,
  Theme,
} from './types';

// This maps event names to the event shape, used by emittery. Extends this when adding new subscribable events
interface EventMap<DATA extends LocalData> {
  data: DATA;
  broadcast: unknown;
}

export default class FalconApi<
  DATA extends LocalData = LocalData,
> extends FalconPublicApis {
  public events = new Emittery<EventMap<DATA>>();
  public data?: DATA;
  public bridge: Bridge<DATA> = new Bridge<DATA>({
    onDataUpdate: (data) => this.handleDataUpdate(data),
    onBroadcast: (msg) => this.handleBroadcastMessage(msg),
    onLivereload: () => this.handleLivereloadMessage(),
  });

  public ui = new UI(this.bridge);

  private resizeTracker?: ResizeTracker<DATA>;
  private cloudFunctions: CloudFunction<DATA>[] = [];
  private apiIntegrations: ApiIntegration<DATA>[] = [];
  private collections: Collection<DATA>[] = [];

  public async connect(): Promise<void> {
    const { origin, data } = await this.bridge.postMessage({ type: 'connect' });

    this.bridge.setOrigin(origin);
    this.data = data;

    this.updateTheme(data?.theme);
    this.resizeTracker = new ResizeTracker(this.bridge);

    this.isConnected = true;
  }

  public sendBroadcast(payload: unknown) {
    this.bridge.sendUnidirectionalMessage({ type: 'broadcast', payload });
  }

  public async uploadFile<TYPE extends FileUploadType>(
    fileUploadType: TYPE,
    initialData?: PayloadForFileUploadType<TYPE>,
  ): Promise<ResponseForFileUploadType<TYPE> | undefined> {
    return this.bridge.postMessage({
      type: 'fileUpload',
      fileUploadType,
      payload: initialData,
    });
  }

  private handleDataUpdate(dataMessage: DataUpdateMessage<DATA>): void {
    this.data = dataMessage.payload;
    this.updateTheme(this.data.theme);

    this.events.emit('data', this.data);
  }

  private handleBroadcastMessage(message: BroadcastMessage): void {
    this.events.emit('broadcast', message.payload);
  }

  private handleLivereloadMessage(): void {
    document.location.reload();
  }

  private updateTheme(activeTheme?: Theme) {
    if (!activeTheme) {
      return;
    }

    const inactiveTheme =
      activeTheme === 'theme-dark' ? 'theme-light' : 'theme-dark';

    document.documentElement.classList.add(activeTheme);
    document.documentElement.classList.remove(inactiveTheme);
  }

  cloudFunction(definition: CloudFunctionDefinition ) {
    assertConnection(this);

    const cf = new CloudFunction(this, definition);

    this.cloudFunctions.push(cf);

    return cf;
  }

  apiIntegration({
    definitionId,
    operationId,
  }: {
    operationId: string;
    definitionId?: string;
  }) {
    assertConnection(this);

    if (!this.data) {
      throw Error('Data from console is missing');
    }

    const cf = new ApiIntegration(this, {
      operationId,
      definitionId: definitionId ?? this.data?.app.id,
    });

    this.apiIntegrations.push(cf);

    return cf;
  }

  collection({ collection }: { collection: string }) {
    assertConnection(this);

    const co = new Collection(this, { collection });

    this.collections.push(co);

    return co;
  }

  @Memoize()
  get navigation() {
    assertConnection(this);

    return new Navigation(this);
  }

  @Memoize()
  get logscale() {
    assertConnection(this);

    return new Logscale(this);
  }

  destroy() {
    this.cloudFunctions.forEach((cf) => cf.destroy());

    this.resizeTracker?.destroy();
    this.bridge.destroy();
  }
}
