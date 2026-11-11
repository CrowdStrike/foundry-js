import type { Bridge } from '../bridge';
import type { AgentWorksInvokeParams, LocalData } from '../types';
interface AgentStreamEvents {
    /** A raw chunk forwarded from the AgentWorks streaming API. */
    data: unknown;
    /** The stream encountered an error and has terminated. */
    error: Error;
    /** The stream completed successfully. */
    end: undefined;
}
type AgentStreamEventName = keyof AgentStreamEvents;
/**
 * A single agent invocation stream. Subscribe with {@link on} to receive
 * `data` chunks as they arrive, plus a terminal `end` or `error`:
 *
 * ```js
 * const stream = api.agentWorks.invoke('agent-id', { prompt: '...' });
 *
 * stream.on('data', (chunk) => render(chunk));
 * stream.on('error', (err) => showError(err));
 * stream.on('end', () => finish());
 *
 * // cancel early:
 * stream.abort();
 * ```
 */
export declare class AgentStream<DATA extends LocalData = LocalData> {
    private emitter;
    private bridge;
    private messageId;
    private close;
    private onFinish?;
    private finished;
    /**
     * @internal
     */
    constructor(bridge: Bridge<DATA>, request: {
        agentId: string;
        params?: AgentWorksInvokeParams;
    }, onFinish?: () => void);
    private handlePayload;
    private finish;
    /**
     * Subscribe to a stream event. Returns an unsubscribe function.
     */
    on<Name extends AgentStreamEventName>(eventName: Name, listener: (eventData: AgentStreamEvents[Name]) => void): () => void;
    /**
     * Unsubscribe a previously registered listener.
     */
    off<Name extends AgentStreamEventName>(eventName: Name, listener: (eventData: AgentStreamEvents[Name]) => void): void;
    /**
     * Cancel an in-flight stream. Tears down the host-side HTTP stream and emits
     * a final `end`. Safe to call multiple times.
     */
    abort(): void;
    /**
     * @internal
     */
    destroy(): void;
}
/**
 * Entry point for invoking AgentWorks agents. Accessed via `api.agentWorks`.
 */
export declare class AgentWorks<DATA extends LocalData = LocalData> {
    private readonly bridge;
    private streams;
    /**
     * @internal
     */
    constructor(bridge: Bridge<DATA>);
    /**
     * Invoke an AgentWorks agent and stream its response.
     *
     * @param agentId the ID of the agent to invoke
     * @param params parameters forwarded as-is to the AgentWorks API
     * @returns an {@link AgentStream} emitting `data`, `end`, and `error` events
     */
    invoke(agentId: string, params?: AgentWorksInvokeParams): AgentStream<DATA>;
    private remove;
    /**
     * @internal
     */
    destroy(): void;
}
export {};
