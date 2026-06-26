import Emittery from 'emittery';

import type { Bridge } from '../bridge';
import type {
  AgentWorksInvokeParams,
  AgentWorksResponseMessage,
  LocalData,
} from '../types';

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
export class AgentStream<DATA extends LocalData = LocalData> {
  private emitter = new Emittery<AgentStreamEvents>();
  private bridge: Bridge<DATA>;
  private messageId: string;
  private close: () => void;
  private onFinish?: () => void;
  private finished = false;

  /**
   * @internal
   */
  constructor(
    bridge: Bridge<DATA>,
    request: { agentId: string; params?: AgentWorksInvokeParams },
    onFinish?: () => void,
  ) {
    this.bridge = bridge;
    this.onFinish = onFinish;

    const { messageId, close } = bridge.openStream(
      {
        type: 'agentWorks',
        payload: {
          action: 'invoke',
          agentId: request.agentId,
          params: request.params,
        },
      },
      (payload) => this.handlePayload(payload),
    );

    this.messageId = messageId;
    this.close = close;
  }

  private handlePayload(payload: AgentWorksResponseMessage['payload']): void {
    if (this.finished) {
      return;
    }

    switch (payload.subtype) {
      case 'chunk':
        void this.emitter.emit('data', payload.data);
        break;
      case 'complete':
        this.finish();
        void this.emitter.emit('end');
        break;
      case 'error':
        this.finish();
        void this.emitter.emit('error', new Error(payload.error));
        break;
    }
  }

  private finish(): void {
    if (this.finished) {
      return;
    }

    this.finished = true;
    this.close();
    this.onFinish?.();
  }

  /**
   * Subscribe to a stream event. Returns an unsubscribe function.
   */
  public on<Name extends AgentStreamEventName>(
    eventName: Name,
    listener: (eventData: AgentStreamEvents[Name]) => void,
  ): () => void {
    return this.emitter.on(eventName, listener);
  }

  /**
   * Unsubscribe a previously registered listener.
   */
  public off<Name extends AgentStreamEventName>(
    eventName: Name,
    listener: (eventData: AgentStreamEvents[Name]) => void,
  ): void {
    this.emitter.off(eventName, listener);
  }

  /**
   * Cancel an in-flight stream. Tears down the host-side HTTP stream and emits
   * a final `end`. Safe to call multiple times.
   */
  public abort(): void {
    if (this.finished) {
      return;
    }

    this.bridge.sendStreamMessage(this.messageId, {
      type: 'agentWorks',
      payload: { action: 'abort' },
    });

    this.finish();
    void this.emitter.emit('end');
  }

  /**
   * @internal
   */
  public destroy(): void {
    this.abort();
    this.emitter.clearListeners();
  }
}

/**
 * Entry point for invoking AgentWorks agents. Accessed via `api.agentWorks`.
 */
export class AgentWorks<DATA extends LocalData = LocalData> {
  private streams: AgentStream<DATA>[] = [];

  /**
   * @internal
   */
  constructor(private readonly bridge: Bridge<DATA>) {}

  /**
   * Invoke an AgentWorks agent and stream its response.
   *
   * @param agentId the ID of the agent to invoke
   * @param params parameters forwarded as-is to the AgentWorks API
   * @returns an {@link AgentStream} emitting `data`, `end`, and `error` events
   */
  public invoke(
    agentId: string,
    params?: AgentWorksInvokeParams,
  ): AgentStream<DATA> {
    const stream: AgentStream<DATA> = new AgentStream(
      this.bridge,
      { agentId, params },
      () => this.remove(stream),
    );

    this.streams.push(stream);

    return stream;
  }

  private remove(stream: AgentStream<DATA>): void {
    const index = this.streams.indexOf(stream);

    if (index !== -1) {
      this.streams.splice(index, 1);
    }
  }

  /**
   * @internal
   */
  public destroy(): void {
    [...this.streams].forEach((stream) => stream.destroy());
    this.streams = [];
  }
}
