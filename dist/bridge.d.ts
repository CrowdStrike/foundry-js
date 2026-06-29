import type { AgentWorksRequestMessage, AgentWorksResponseMessage, BroadcastMessage, DataUpdateMessage, LivereloadMessage, LocalData, MessageEnvelope, RequestMessage, ResponseMessage, UnidirectionalRequestMessage } from './types';
interface BridgeOptions<DATA extends LocalData> {
    onDataUpdate?: (event: DataUpdateMessage<DATA>) => void;
    onBroadcast?: (event: BroadcastMessage) => void;
    onLivereload?: (event: LivereloadMessage) => void;
}
export declare class Bridge<DATA extends LocalData = LocalData> {
    private onDataUpdate;
    private onBroadcast;
    private onLivereload;
    private pendingMessages;
    private streamSubscriptions;
    private targetOrigin;
    constructor({ onDataUpdate, onBroadcast, onLivereload, }?: BridgeOptions<DATA>);
    destroy(): void;
    setOrigin(origin: string): void;
    sendUnidirectionalMessage(message: UnidirectionalRequestMessage): void;
    postMessage<REQ extends RequestMessage = RequestMessage, ResolvedValue = void>(message: REQ): Promise<ResolvedValue>;
    /**
     * Open a long-lived stream. Unlike {@link postMessage}, the subscription is
     * not removed after the first response: many messages may be delivered for
     * the same `messageId` until the caller invokes the returned `close()`.
     *
     * No timeout is applied, since a stream can run for an arbitrary duration.
     */
    openStream(message: AgentWorksRequestMessage, subscriber: (_payload: AgentWorksResponseMessage['payload']) => void): {
        messageId: string;
        close: () => void;
    };
    /**
     * Send a follow-up message that reuses an existing stream's `messageId`
     * (e.g. an `abort` request for an in-flight invocation).
     */
    sendStreamMessage(messageId: string, message: AgentWorksRequestMessage): void;
    private handleMessageWrapper;
    handleMessage: (event: MessageEvent<MessageEnvelope<ResponseMessage<DATA>> | unknown>) => void;
    throwError(message: string): void;
}
export {};
