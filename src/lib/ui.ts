import type { Bridge } from '../bridge';
import type {
  ExtensionIdentifier,
  FileUploadType,
  LocalData,
  OpenModalOptions,
  PayloadForFileUploadType,
  ResponseForFileUploadType,
} from '../types';

/**
 * Invoke UI features within the main Falcon Console.
 */
export class UI<DATA extends LocalData = LocalData> {
  constructor(private bridge: Bridge<DATA>) {}

  /**
   * Open a modal within the Falcon Console, rendering an UI extension of your choice.
   * 
   * ```js
   * const result = await api.ui.openModal({ id: '<extension ID as defined in the manifest>', type: 'extension' }, 'Modal title', {
      path: '/foo',
      data: { foo: 'bar' },
      size: 'lg',
      align: 'top',
    });
    ```
   *
   * @param extension The identifier of the extension, consisting of {@link ExtensionIdentifier.id} and {@link ExtensionIdentifier.type}
   * @param title The title to render in the header of the modal
   * @param options
   * @returns a Promise that resolves with the data passed to {@link closeModal}, or `undefined` if the user dismisses it
   */
  public async openModal<PAYLOAD = unknown>(
    extension: ExtensionIdentifier,
    title: string,
    options: OpenModalOptions = {},
  ): Promise<PAYLOAD | undefined> {
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

  /**
   * Close a modal already opened via {@link openModal}. This can be called both by the extension that is rendered inside the modal or by the extension that opened the modal.
   *
   * @param payload the data to return to the caller that opened the modal as the value of the resolved promise
   */
  public closeModal<PAYLOAD = unknown>(payload?: PAYLOAD) {
    this.bridge.sendUnidirectionalMessage({
      type: 'closeModal',
      payload,
    });
  }

  /**
   * This opens a file upload modal inside the Falcon Console, to support file uploads, even large binary files.
   *
   * @param fileUploadType the type of file upload
   * @param initialData data that you want to pre-populate the form with
   */
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
