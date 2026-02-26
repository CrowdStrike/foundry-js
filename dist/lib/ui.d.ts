import { type ExtensionIdentifier, type FileUploadType, type LocalData, type OpenModalOptions, type PayloadForFileUploadType, type ResponseForFileUploadType } from '../types';
import type { Bridge } from '../bridge';
/**
 * Invoke UI features within the main Falcon Console.
 */
export declare class UI<DATA extends LocalData = LocalData> {
    private bridge;
    constructor(bridge: Bridge<DATA>);
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
    openModal<PAYLOAD = unknown>(extension: ExtensionIdentifier, title: string, options?: OpenModalOptions): Promise<PAYLOAD | undefined>;
    /**
     * Close a modal already opened via {@link openModal}. This can be called both by the extension that is rendered inside the modal or by the extension that opened the modal.
     *
     * @param payload the data to return to the caller that opened the modal as the value of the resolved promise
     */
    closeModal<PAYLOAD = unknown>(payload?: PAYLOAD): void;
    /**
     * This opens a file upload modal inside the Falcon Console, to support file uploads, even large binary files.
     *
     * @param fileUploadType the type of file upload
     * @param initialData data that you want to pre-populate the form with
     */
    uploadFile<TYPE extends FileUploadType>(fileUploadType: TYPE, initialData?: PayloadForFileUploadType<TYPE>): Promise<ResponseForFileUploadType<TYPE> | undefined>;
}
