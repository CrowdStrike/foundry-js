import FalconApi from '../../src/';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { connectApi, nextTick } from '../helpers';

import type { AgentStream } from '../../src/abstraction/agent-works';
import type {
  AgentWorksRequestMessage,
  AgentWorksResponseMessage,
  MessageEnvelope,
} from '../../src/types';

let api: FalconApi;

beforeEach(async () => {
  api = new FalconApi();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-next-line
  window.parent = new Window();

  await connectApi(api);
});

afterEach(() => {
  api.destroy();
  vi.restoreAllMocks();
});

/**
 * Listen for the next outgoing agentWorks request and return its messageId, so
 * tests can simulate host responses correlated to the invocation.
 */
function captureInvocation(): Promise<{ messageId: string }> {
  return new Promise((resolve) => {
    window.parent.addEventListener(
      'message',
      (event: MessageEvent<MessageEnvelope<AgentWorksRequestMessage>>) => {
        if (event.data.message.type === 'agentWorks') {
          resolve({ messageId: event.data.meta.messageId });
        }
      },
      { once: true },
    );
  });
}

/** Simulate the host sending one stream message back to the extension. */
function sendFromHost(
  messageId: string,
  payload: AgentWorksResponseMessage['payload'],
) {
  const response: MessageEnvelope<AgentWorksResponseMessage> = {
    message: { type: 'agentWorks', payload },
    meta: { messageId },
  };

  window.postMessage(response);
}

test('it sends an invoke request with the agent id and params', async () => {
  const spy = vi.spyOn(window.parent, 'postMessage');

  api.agentWorks.invoke('agent-1', { prompt: 'hello' });

  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({
      message: {
        type: 'agentWorks',
        payload: {
          action: 'invoke',
          agentId: 'agent-1',
          params: { prompt: 'hello' },
        },
      },
    }),
    expect.anything(),
  );
});

test('it emits data events for each chunk, in order', async () => {
  const pending = captureInvocation();
  const stream = api.agentWorks.invoke('agent-1');
  const { messageId } = await pending;

  const chunks: unknown[] = [];
  stream.on('data', (chunk) => chunks.push(chunk));

  sendFromHost(messageId, { subtype: 'chunk', data: 'a' });
  sendFromHost(messageId, { subtype: 'chunk', data: 'b' });
  sendFromHost(messageId, { subtype: 'chunk', data: 'c' });
  await nextTick();

  expect(chunks).toEqual(['a', 'b', 'c']);
});

test('it emits end on complete', async () => {
  const pending = captureInvocation();
  const stream = api.agentWorks.invoke('agent-1');
  const { messageId } = await pending;

  const ended = vi.fn();
  stream.on('end', ended);

  sendFromHost(messageId, { subtype: 'chunk', data: 'a' });
  sendFromHost(messageId, { subtype: 'complete' });
  await nextTick();

  expect(ended).toHaveBeenCalledOnce();
});

test('it emits an Error on error subtype', async () => {
  const pending = captureInvocation();
  const stream = api.agentWorks.invoke('agent-1');
  const { messageId } = await pending;

  const errors: Error[] = [];
  stream.on('error', (err) => errors.push(err));

  sendFromHost(messageId, { subtype: 'error', error: 'boom' });
  await nextTick();

  expect(errors).toHaveLength(1);
  expect(errors[0]).toBeInstanceOf(Error);
  expect(errors[0].message).toBe('boom');
});

test('it ignores chunks received after the stream finishes', async () => {
  const pending = captureInvocation();
  const stream = api.agentWorks.invoke('agent-1');
  const { messageId } = await pending;

  const chunks: unknown[] = [];
  stream.on('data', (chunk) => chunks.push(chunk));

  sendFromHost(messageId, { subtype: 'complete' });
  sendFromHost(messageId, { subtype: 'chunk', data: 'late' });
  await nextTick();

  expect(chunks).toEqual([]);
});

test('abort sends an abort message and emits end', async () => {
  const pending = captureInvocation();
  const stream: AgentStream = api.agentWorks.invoke('agent-1');
  const { messageId } = await pending;

  const ended = vi.fn();
  stream.on('end', ended);

  const spy = vi.spyOn(window.parent, 'postMessage');
  stream.abort();

  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({
      message: { type: 'agentWorks', payload: { action: 'abort' } },
      meta: expect.objectContaining({ messageId }),
    }),
    expect.anything(),
  );
  await nextTick();
  expect(ended).toHaveBeenCalledOnce();
});

test('abort is idempotent and stops further chunks', async () => {
  const pending = captureInvocation();
  const stream = api.agentWorks.invoke('agent-1');
  const { messageId } = await pending;

  const chunks: unknown[] = [];
  stream.on('data', (chunk) => chunks.push(chunk));

  stream.abort();
  stream.abort();

  sendFromHost(messageId, { subtype: 'chunk', data: 'late' });
  await nextTick();

  expect(chunks).toEqual([]);
});

test('destroy aborts open streams', async () => {
  const pending = captureInvocation();
  const stream = api.agentWorks.invoke('agent-1');
  await pending;

  const abortSpy = vi.spyOn(stream, 'abort');

  api.destroy();

  expect(abortSpy).toHaveBeenCalled();
});
