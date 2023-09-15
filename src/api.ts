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
  LocalData,
  Theme,
} from './types';

// This maps event names to the event shape, used by emittery. Extends this when adding new subscribable events
interface EventMap<DATA extends LocalData> {
  data: DATA;
  broadcast: unknown;
}
/**
 * This is the main class and only entrypoint for engaging with the Falcon APIs from an Foundry UI extension or page.
 *
 * At the very minimum, you would have to instantiate the class and connect to the Falcon Console:
 *
 * ```js
 * import FalconApi from '@crowdstrike/foundry-js';
 *
 * const api = new FalconApi();
 *
 * await api.connect();
 * ```
 *
 */
export default class FalconApi<DATA extends LocalData = LocalData> {
  /**
   * @internal
   */
  public isConnected = false;

  /**
   * An event emitter that allows you to subscribe to events issued by the Falcon Console.
   *
   * Currently supported event types:
   * * `data`: fires when {@link data} is updated.
   * * `broadcast`: this event is received when another extension of the same app has send a `broadcast` event via {@link sendBroadcast}.
   *
   * ```js
   * api.events.on('data', (newData) => console.log('new data received:', newData));
   * ```
   */
  public events = new Emittery<EventMap<DATA>>();

  /**
   * The "local data" that your extension receives from the Falcon Console. This can vary depending on the state of the Falcon Console and the socket of the extension.
   *
   * At the very least it will contain the data specified by the {@link LocalData} interface.
   */
  public data?: DATA;
  public bridge: Bridge<DATA> = new Bridge<DATA>({
    onDataUpdate: (data) => this.handleDataUpdate(data),
    onBroadcast: (msg) => this.handleBroadcastMessage(msg),
    onLivereload: () => this.handleLivereloadMessage(),
  });
  public api = new FalconPublicApis(this);

  /**
   * The {@link UI} class contains methods to invoke UI features within the main Falcon Console.
   */
  public ui = new UI(this.bridge);

  private resizeTracker?: ResizeTracker<DATA>;
  private cloudFunctions: CloudFunction<DATA>[] = [];
  private apiIntegrations: ApiIntegration<DATA>[] = [];
  private collections: Collection<DATA>[] = [];

  /**
   * Connect to the main Falcon Console from within your UI extension.
   *
   * This establishes a connection to send messages between the extension and the Falcon Console. Only when established you will be able to call other APIs.
   */
  public async connect(): Promise<void> {
    const { origin, data } = await this.bridge.postMessage({ type: 'connect' });

    this.bridge.setOrigin(origin);
    this.data = data;

    this.updateTheme(data?.theme);
    this.resizeTracker = new ResizeTracker(this.bridge);

    this.isConnected = true;
  }

  /**
   * The ID of the Foundry app this UI extension belongs to.
   */
  public get appId() {
    return this.data?.app.id;
  }

  /**
   * Sending broadcast messages is a mechanism for allowing communication between different UI extensions, when they are displayed at the same time.
   * When sending a broadcast message, other extensions need to listen for the `broadcast` event on the {@link events} event emitter.
   *
   * Note that broadcast messages are only dispatched between UI extensions of the same app!
   *
   * @param payload the data you want to send to other UI extensions
   */
  public sendBroadcast(payload: unknown) {
    this.bridge.sendUnidirectionalMessage({ type: 'broadcast', payload });
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

  /**
   * Create a {@link CloudFunction} to integrate with Falcon's "Function as a Service" platform.
   *
   * @param definition
   * @returns
   */
  cloudFunction(definition: CloudFunctionDefinition) {
    assertConnection(this);

    const cf = new CloudFunction(this, definition);

    this.cloudFunctions.push(cf);

    return cf;
  }

  /**
   * Create an {@link ApiIntegration} to call external APIs.
   *
   * @param defintition
   * @returns
   */
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

    const apiIntegration = new ApiIntegration(this, {
      operationId,
      definitionId: definitionId ?? this.data?.app.id,
    });

    this.apiIntegrations.push(apiIntegration);

    return apiIntegration;
  }

  /**
   * Create a {@link Collection} to write to and query Falcon's custom storage service.
   *
   * @param definition
   * @returns
   */
  collection({ collection }: { collection: string }) {
    assertConnection(this);

    const co = new Collection(this, { collection });

    this.collections.push(co);

    return co;
  }

  /**
   * The {@link Navigation} class provides functionality to navigate to other pages.
   */
  @Memoize()
  get navigation() {
    assertConnection(this);

    return new Navigation(this);
  }

  /**
   * The {@link Logscale} class allows you to read and write to your custom LogScale repository.
   */
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
