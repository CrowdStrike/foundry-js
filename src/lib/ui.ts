import type { Bridge } from '../bridge';
import type {
  ExtensionIdentifier,
  FileUploadType,
  LocalData,
  OpenModalOptions,
  PayloadForFileUploadType,
  ResponseForFileUploadType,
} from '../types';

export class UI<DATA extends LocalData = LocalData> {
  constructor(private bridge: Bridge<DATA>) {}

  public async openModal<PAYLOAD = unknown>(
    extension: ExtensionIdentifier,
    title: string,
    options: OpenModalOptions = {},
  ): Promise<PAYLOAD> {
    const result = await this.bridge.postMessage({
      type: 'openModal',
      payload: {
        extension,
        title,
        options,
      },
    });

    if (result instanceof Error) {
      throw result;
    }

    return result as PAYLOAD;
  }

  public closeModal<PAYLOAD = unknown>(payload?: PAYLOAD) {
    this.bridge.sendUnidirectionalMessage({
      type: 'closeModal',
      payload,
    });
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
}
