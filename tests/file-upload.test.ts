import FalconApi from '../src';
import { afterEach, beforeEach, expect, test } from 'vitest';
import type {
  FileUploadRequestMessage,
  FileUploadResponseMessage,
  MessageEnvelope,
} from '../src';

let api: FalconApi;

beforeEach(async () => {
  api = new FalconApi();
  window.parent = new Window();
});

afterEach(() => api.destroy());

test('it can send a RTR file-upload request and wait for response', async () => {
  // simulate ready answer coming back from main thread
  window.parent.addEventListener(
    'message',
    (
      message: MessageEvent<
        MessageEnvelope<FileUploadRequestMessage<'remote-response'>>
      >,
    ) => {
      const response: MessageEnvelope<
        FileUploadResponseMessage<'remote-response'>
      > = {
        message: {
          type: 'fileUpload',
          fileUploadType: 'remote-response',
          payload: {
            resources: [{ foo: 'bar' }],
          },
        },
        meta: {
          messageId: message.data.meta.messageId,
          version: 'current',
        },
      };

      window.postMessage(response);
    },
  );

  const result = await api.uploadFile('remote-response');

  expect(result).toStrictEqual({
    resources: [{ foo: 'bar' }],
  });
});

test('it will not time out', async () => {
  // we intentionally do not create a response message, and so we also do not await this call, as this promise will never resolve or reject
  api.uploadFile('remote-response');

  // any other request would have timed out at this point...
  await new Promise((r) => setTimeout(r, 50));
});
