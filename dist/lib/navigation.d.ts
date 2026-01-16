import type FalconApi from '../api';
import type { LocalData } from '../types';
import type { NavigateToRequestMessage } from '../types';
declare const ALLOWED_TARGETS: readonly ["_self", "_blank"];
export declare class Navigation<DATA extends LocalData = LocalData> {
    private readonly falcon;
    constructor(falcon: FalconApi<DATA>);
    navigateTo({ path, type, target, metaKey, ctrlKey, shiftKey, }: {
        path: string;
        target?: NavigateToRequestMessage['payload']['target'];
        type?: NavigateToRequestMessage['payload']['type'];
        metaKey?: boolean;
        ctrlKey?: boolean;
        shiftKey?: boolean;
    }): Promise<void>;
    /**
     * @deprecated Use navigateTo directly
     */
    onClick(event: MouseEvent | KeyboardEvent, defaultTarget?: (typeof ALLOWED_TARGETS)[number], defaultType?: NavigateToRequestMessage['payload']['type']): Promise<void>;
}
export {};
