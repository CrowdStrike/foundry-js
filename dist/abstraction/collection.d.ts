import type FalconApi from '../api';
import type { LocalData } from '../types';
export type CollectionItem = object;
interface CollectionDefinition {
    collection: string;
}
interface CollectionSearchDefinition {
    /**
     * Falcon Query Language (FQL) to filter the requested collections
     * @see https://falcon.crowdstrike.com/documentation/page/d3c84a1b/falcon-query-language-fql
     */
    filter: string;
    offset: string;
    sort: string;
    limit: number;
}
interface CollectionListDefinition {
    end: string;
    limit: number;
    start: string;
}
export declare class Collection<DATA extends LocalData = LocalData, ITEM extends CollectionItem = CollectionItem> {
    private readonly falcon;
    private readonly definition;
    constructor(falcon: FalconApi<DATA>, definition: CollectionDefinition);
    /**
     * Write data to the collection
     *
     * @param key
     * @param data
     * @returns
     */
    write<T extends ITEM = ITEM>(key: string, data: T): Promise<T>;
    /**
     * Read the data for the given `key`
     *
     * @param key
     * @returns
     */
    read<T extends ITEM = ITEM>(key: string): Promise<T>;
    /**
     * Delete the data for the given `key`
     *
     * @param key
     * @returns
     */
    delete(key: string): Promise<void>;
    /**
     * Search for data
     *
     * @param searchDefinition
     * @returns
     */
    search<T extends ITEM = ITEM>({ filter, offset, sort, limit, }: CollectionSearchDefinition): Promise<T[]>;
    /**
     * lists the object keys in the specified collection
     *
     * @param searchDefinition
     * @returns
     */
    list(options?: CollectionListDefinition): Promise<void>;
}
export {};
