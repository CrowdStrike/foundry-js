import type FalconApi from '../api';
import type { CollectionRequestMessage, LocalData } from '../types';

interface CollectionDefinition {
  collection: string;
}

interface CollectionSearchDefinition {
  startKey: string;
  endKey: string;
  limit: string;
}

export class Collection<DATA extends LocalData = LocalData> {
  constructor(
    private readonly falcon: FalconApi<DATA>,
    private readonly definition: CollectionDefinition,
  ) {}

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

  public async search({ startKey, endKey, limit }: CollectionSearchDefinition) {
    return this.falcon.bridge.postMessage<CollectionRequestMessage>({
      type: 'collection',
      payload: {
        type: 'search',
        startKey,
        endKey,
        limit,
        collection: this.definition.collection,
      },
    });
  }
}
