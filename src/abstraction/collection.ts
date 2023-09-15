import type FalconApi from '../api';
import type { CollectionRequestMessage, LocalData } from '../types';

interface CollectionDefinition {
  collection: string;
}

interface CollectionSearchDefinition {
  // @todo what is this? How can we document this?
  filter: string;
  offset: string;
  sort: string;
  limit: number;
}

export class Collection<DATA extends LocalData = LocalData> {
  constructor(
    private readonly falcon: FalconApi<DATA>,
    private readonly definition: CollectionDefinition,
  ) {}

  /**
   * Write data to the collection
   *
   * @param key
   * @param data
   * @returns
   */
  public async write(key: string, data: Record<string, unknown>) {
    return this.falcon.bridge.postMessage<CollectionRequestMessage>({
      type: 'collection',
      payload: {
        type: 'write',
        key,
        collection: this.definition.collection,
        data,
      },
    });
  }

  /**
   * Read the data for the given `key`
   *
   * @param key
   * @returns
   */
  public async read(key: string) {
    return this.falcon.bridge.postMessage<CollectionRequestMessage>({
      type: 'collection',
      payload: {
        type: 'read',
        key,
        collection: this.definition.collection,
      },
    });
  }

  /**
   * Delete the data for the given `key`
   *
   * @param key
   * @returns
   */
  public async delete(key: string) {
    return this.falcon.bridge.postMessage<CollectionRequestMessage>({
      type: 'collection',
      payload: {
        type: 'delete',
        key,
        collection: this.definition.collection,
      },
    });
  }

  /**
   * Search for data
   *
   * @param searchDefinition
   * @returns
   */
  public async search({
    filter,
    offset,
    sort,
    limit,
  }: CollectionSearchDefinition) {
    return this.falcon.bridge.postMessage<CollectionRequestMessage>({
      type: 'collection',
      payload: {
        type: 'search',
        filter,
        limit,
        offset,
        sort,
        collection: this.definition.collection,
      },
    });
  }
}
