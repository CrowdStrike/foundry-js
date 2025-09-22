import type { ApiIdentifier } from './apis/available-apis';
import type { ApiRequestMessage, ApiResponseMessage } from './apis/types';
import type { PostEntitiesPutFilesV1ApiResponse } from './apis/remote-response';
export type QueryParam = string | number | string[] | number[] | boolean;
export interface BaseUrlParams {
    [key: string]: QueryParam | undefined;
}
export type MessageType = 'connect' | 'navigateTo' | 'loggingapi' | 'api' | 'data' | 'broadcast' | 'fileUpload' | 'collection' | 'livereload' | 'resize' | 'openModal' | 'closeModal';
export interface BaseMessage {
    type: MessageType;
    payload?: unknown;
}
export interface ConnectRequestMessage extends BaseMessage {
    type: 'connect';
}
export interface ConnectResponseMessage<DATA extends LocalData = LocalData> extends BaseMessage {
    type: 'connect';
    payload: {
        origin: string;
        data?: DATA;
    };
}
export type Theme = 'theme-light' | 'theme-dark';
export interface UserData {
    uuid: string;
    username: string;
}
/**
 * A map of custom app permissions, mapping permission keys to a boolean, indicating the permission status for the current user and that particular permission.
 */
export type Permissions = Record<string, boolean>;
/**
 * The minimum {@link FalconApi.data} every UI extension receives from the Falcon Console.
 */
export interface LocalData {
    app: {
        id: string;
    };
    /**
     * Details of the currently signed in user
     */
    user: UserData;
    /**
     * The current light or dark mode in the Falcon Console
     */
    theme: Theme;
    /**
     * Current customer ID
     */
    cid: string;
    /**
     * The locale of the current user, e.g. 'en-us'
     */
    locale: string;
    /**
     * Timezone of the current user, e.g. 'America/New_York'
     */
    timezone?: string;
    /**
     * The date format preferred by the current user, in a [`moment.js` format](https://momentjs.com/docs/#/displaying/format/)
     */
    dateFormat?: string;
    /**
     * A map of custom app permissions, mapping permission keys to a boolean, indicating the permission status for the current user and that particular permission.
     */
    permissions?: Permissions;
    [key: string]: unknown;
}
export interface DataUpdateMessage<DATA extends LocalData = LocalData> extends BaseMessage {
    type: 'data';
    payload: DATA;
}
export interface ResizeMessage extends BaseMessage {
    type: 'resize';
    payload: {
        height: number;
    };
}
export type CloudFunctionDefinition = {
    id: string;
    version?: number;
} | {
    name: string;
    version?: number;
};
export interface LogscaleRequestMessage extends BaseMessage {
    type: 'loggingapi';
    payload: {
        type: 'ingest' | 'dynamic-execute';
        data: {
            id: string;
            version?: string;
            [key: string]: unknown;
        } | {
            name: string;
            version?: string;
            [key: string]: unknown;
        };
        tag?: string;
        tagSource?: string;
        testData?: boolean;
    } | {
        type: 'saved-query-execute';
        data: {
            id: string;
            version?: string;
            [key: string]: unknown;
        } | {
            name: string;
            version?: string;
            [key: string]: unknown;
        };
        tag?: string;
        tagSource?: string;
        testData?: boolean;
    };
}
export interface LogscaleResponseMessage extends BaseMessage {
    type: 'loggingapi';
    payload: unknown;
}
export interface NavigateToRequestMessage extends BaseMessage {
    type: 'navigateTo';
    payload: {
        path: string;
        type: 'internal' | 'falcon';
        target: '_self' | '_blank';
        metaKey: boolean;
        ctrlKey: boolean;
        shiftKey: boolean;
    };
}
export interface NavigateToResponseMessage extends BaseMessage {
    type: 'navigateTo';
}
export interface CollectionRequestMessage extends BaseMessage {
    type: 'collection';
    payload: {
        type: 'write';
        key: string;
        collection: string;
        data: Record<string, unknown>;
    } | {
        type: 'search';
        filter?: string;
        limit?: number;
        offset?: string;
        sort?: string;
        collection: string;
    } | {
        type: 'list';
        end?: string;
        limit?: number;
        start?: string;
        collection: string;
    } | {
        type: 'read' | 'delete';
        key: string;
        collection: string;
    };
}
export interface CollectionResponseMessage extends BaseMessage {
    type: 'collection';
    payload: unknown;
}
export interface OpenModalOptions {
    path?: string;
    /**
     * additional local data to pass to the modal's extension
     */
    data?: Record<string, unknown>;
    /**
     * Vertical alignment of the modal, "top" or undefined (Default is center)
     */
    align?: 'top';
    /**
     * Width of the modal (Default is "md")
     */
    size?: 'sm' | 'md' | 'lg' | 'xl';
}
export interface OpenModalRequestMessage extends BaseMessage {
    type: 'openModal';
    payload: {
        extension: ExtensionIdentifier;
        title: string;
        options: OpenModalOptions;
    };
}
export interface CloseModalRequestMessage<PAYLOAD = unknown> extends BaseMessage {
    type: 'closeModal';
    payload: PAYLOAD;
}
export interface OpenModalResponseMessage<PAYLOAD = unknown> extends BaseMessage {
    type: 'openModal';
    payload: PAYLOAD;
}
export interface BroadcastMessage<PAYLOAD = unknown> extends BaseMessage {
    type: 'broadcast';
    payload: PAYLOAD;
}
export interface LivereloadMessage extends BaseMessage {
    type: 'livereload';
}
export type FileUploadType = 'remote-response';
export interface RtrFileUploadPayload {
    name?: string;
    description?: string;
    comments_for_audit_log?: string;
}
export type RtrFileUploadResponse = PostEntitiesPutFilesV1ApiResponse;
export type PayloadForFileUploadType<TYPE extends FileUploadType> = TYPE extends 'remote-response' ? RtrFileUploadPayload : never;
export type ResponseForFileUploadType<TYPE extends FileUploadType> = TYPE extends 'remote-response' ? RtrFileUploadResponse : never;
export interface FileUploadRequestMessage<T extends FileUploadType = FileUploadType> extends BaseMessage {
    type: 'fileUpload';
    fileUploadType: T;
    payload?: PayloadForFileUploadType<T>;
}
export interface FileUploadResponseMessage<T extends FileUploadType = FileUploadType> extends BaseMessage {
    type: 'fileUpload';
    fileUploadType: T;
    payload?: ResponseForFileUploadType<T>;
}
export interface ApiRequestGetPayload<PARAMS extends BaseUrlParams = BaseUrlParams> {
    params: PARAMS;
}
export interface ApiRequestPostPayload<PARAMS extends BaseUrlParams = BaseUrlParams, BODY = unknown> {
    body: BODY;
    params: PARAMS;
}
type ApiRequestPayload<PARAMS extends BaseUrlParams = BaseUrlParams, BODY = undefined> = BODY extends undefined ? ApiRequestGetPayload<PARAMS> : ApiRequestPostPayload<PARAMS, BODY>;
export interface ApiResponseError {
    code?: number;
    id?: string;
    message: string;
}
export interface ApiResponsePayload<T = unknown> {
    resources?: T[];
    errors?: ApiResponseError[];
}
export interface BaseApiRequestMessage<PARAMS extends BaseUrlParams = BaseUrlParams, BODY = undefined> extends BaseMessage {
    type: 'api';
    api: ApiIdentifier;
    method: string;
    payload: ApiRequestPayload<PARAMS, BODY>;
}
export interface BaseApiResponseMessage<T = unknown> extends BaseMessage {
    type: 'api';
    payload: T;
}
export interface MessageMetadata {
    messageId: string;
    version?: string;
}
export interface MessageEnvelope<M> {
    message: M;
    meta: MessageMetadata;
}
export type UnidirectionalRequestMessage = BroadcastMessage | ResizeMessage | CloseModalRequestMessage;
export type RequestMessage = ConnectRequestMessage | NavigateToRequestMessage | CollectionRequestMessage | ApiRequestMessage | FileUploadRequestMessage | LogscaleRequestMessage | OpenModalRequestMessage;
export { ApiIdentifier };
export type ResponseMessage<DATA extends LocalData = LocalData> = ConnectResponseMessage<DATA> | NavigateToResponseMessage | ApiResponseMessage | DataUpdateMessage<DATA> | BroadcastMessage | FileUploadResponseMessage | CollectionResponseMessage | LivereloadMessage | LogscaleResponseMessage | OpenModalResponseMessage;
import type { ResponseFor as ApiResponseFor } from './apis/types-response-for';
type ResponseFor<REQ extends RequestMessage, DATA extends LocalData> = REQ extends ConnectRequestMessage ? ConnectResponseMessage<DATA> : REQ extends NavigateToRequestMessage ? NavigateToResponseMessage : REQ extends CollectionRequestMessage ? CollectionResponseMessage : REQ extends LogscaleRequestMessage ? LogscaleResponseMessage : REQ extends FileUploadRequestMessage<infer FILEUPLOADTYPE> ? FileUploadResponseMessage<FILEUPLOADTYPE> : REQ extends OpenModalRequestMessage ? OpenModalResponseMessage : ApiResponseFor<REQ>;
export { ResponseFor };
export type PayloadOf<RESPONSE extends ResponseMessage> = RESPONSE['payload'];
export type ExtensionType = 'extension' | 'page';
export interface ExtensionIdentifier {
    type: ExtensionType;
    id: string;
}
