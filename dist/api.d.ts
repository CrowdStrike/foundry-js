import Emittery from 'emittery';
import FalconPublicApis from './apis/public-api';
import { ApiIntegration } from './abstraction/api-integration';
import { Bridge } from './bridge';
import { CloudFunction } from './abstraction/cloud-function';
import { Collection } from './abstraction/collection';
import { Logscale } from './abstraction/logscale';
import { Navigation } from './lib/navigation';
import { UI } from './lib/ui';
import type { CloudFunctionDefinition, LocalData } from './types';
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
    isConnected: boolean;
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
    events: Emittery<EventMap<DATA>, EventMap<DATA> & import("emittery").OmnipresentEventData, DATA extends undefined ? "data" : never>;
    /**
     * The "local data" that your extension receives from the Falcon Console. This can vary depending on the state of the Falcon Console and the socket of the extension.
     *
     * At the very least it will contain the data specified by the {@link LocalData} interface.
     */
    data?: DATA;
    /**
     * @internal
     */
    bridge: Bridge<DATA>;
    /**
     * Namespace for all the {@link FalconPublicApis | Falcon Cloud APIs} you have access to with this SDK.
     */
    api: FalconPublicApis;
    /**
     * The {@link UI} class contains methods to invoke UI features within the main Falcon Console.
     */
    ui: UI<DATA>;
    private resizeTracker?;
    private cloudFunctions;
    private apiIntegrations;
    private collections;
    /**
     * Connect to the main Falcon Console from within your UI extension.
     *
     * This establishes a connection to send messages between the extension and the Falcon Console. Only when established you will be able to call other APIs.
     */
    connect(): Promise<{
        origin: string;
        data?: DATA;
    }>;
    /**
     * The ID of the Foundry app this UI extension belongs to.
     */
    get appId(): string | undefined;
    /**
     * Sending broadcast messages is a mechanism for allowing communication between different UI extensions, when they are displayed at the same time.
     * When sending a broadcast message, other extensions need to listen for the `broadcast` event on the {@link events} event emitter.
     *
     * Note that broadcast messages are only dispatched between UI extensions of the same app!
     *
     * @param payload the data you want to send to other UI extensions
     */
    sendBroadcast(payload: unknown): void;
    private handleDataUpdate;
    private handleBroadcastMessage;
    private handleLivereloadMessage;
    private updateTheme;
    /**
     * Create a {@link CloudFunction} to integrate with Falcon's "Function as a Service" platform.
     *
     * @param definition
     * @returns
     */
    cloudFunction(definition: CloudFunctionDefinition): CloudFunction<DATA>;
    /**
     * Create an {@link ApiIntegration} to call external APIs.
     *
     * @param defintition
     * @returns
     */
    apiIntegration({ definitionId, operationId, }: {
        operationId: string;
        definitionId: string;
    }): ApiIntegration<DATA>;
    /**
     * Create a {@link Collection} to write to and query Falcon's custom storage service.
     *
     * @param definition
     * @returns
     */
    collection({ collection }: {
        collection: string;
    }): Collection<DATA>;
    /**
     * The {@link Navigation} class provides functionality to navigate to other pages.
     */
    get navigation(): Navigation<DATA>;
    /**
     * The {@link Logscale} class allows you to read and write to your custom LogScale repository.
     */
    get logscale(): Logscale<DATA>;
    destroy(): void;
}
export {};
