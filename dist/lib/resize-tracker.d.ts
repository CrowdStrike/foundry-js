import type { Bridge } from '../bridge';
import type { LocalData } from '../types';
/**
 * @internal
 */
export declare class ResizeTracker<DATA extends LocalData = LocalData> {
    private bridge;
    private observer;
    constructor(bridge: Bridge<DATA>);
    private handleResizeEvent;
    destroy(): void;
}
