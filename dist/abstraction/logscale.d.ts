import type FalconApi from '../api';
import type { LocalData, LogscaleRequestMessage } from '../types';
interface WriteProperties {
    tag: LogscaleRequestMessage['payload']['tag'];
    tagSource: LogscaleRequestMessage['payload']['tagSource'];
    testData: LogscaleRequestMessage['payload']['testData'];
}
export declare class Logscale<DATA extends LocalData = LocalData> {
    private readonly falcon;
    constructor(falcon: FalconApi<DATA>);
    /**
     * Write data to LogScale
     *
     * @param data
     * @param properties
     * @returns
     */
    write(data: LogscaleRequestMessage['payload']['data'], properties: WriteProperties): Promise<void>;
    /**
     * Execute a dynamic query
     *
     * @param query
     * @returns Promise that resolves with the data
     */
    query<T = unknown>(query: LogscaleRequestMessage['payload']['data']): Promise<T>;
    /**
     * Execute a saved query
     *
     * @param savedQuery
     * @returns
     */
    savedQuery<T = unknown>(savedQuery: LogscaleRequestMessage['payload']['data']): Promise<T>;
}
export {};
