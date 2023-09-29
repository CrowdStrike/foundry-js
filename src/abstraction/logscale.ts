import type FalconApi from '../api';
import type { LocalData, LogscaleRequestMessage } from '../types';

interface WriteProperties {
  tag: LogscaleRequestMessage['payload']['tag'];
  tagSource: LogscaleRequestMessage['payload']['tagSource'];
  testData: LogscaleRequestMessage['payload']['testData'];
}

export class Logscale<DATA extends LocalData = LocalData> {
  constructor(private readonly falcon: FalconApi<DATA>) {}

  /**
   * Write data to LogScale
   *
   * @param data
   * @param properties
   * @returns
   */
  public async write(
    // @todo the proper type here is unclear  - we need to make clear how the user needs to call this
    data: LogscaleRequestMessage['payload']['data'],
    properties: WriteProperties,
  ) {
    return this.falcon.bridge.postMessage<LogscaleRequestMessage>({
      type: 'loggingapi',
      payload: {
        type: 'ingest',
        data,
        tag: properties?.tag,
        tagSource: properties?.tagSource,
        testData: properties?.testData,
      },
    });
  }

  /**
   * Execute a dynamic query
   *
   * @param query
   * @returns Promise that resolves with the data
   */
  public async query(
    // @todo the proper type here is unclear  - we need to make clear how the user needs to call this
    query: LogscaleRequestMessage['payload']['data'],
  ) {
    return this.falcon.bridge.postMessage<LogscaleRequestMessage>({
      type: 'loggingapi',
      payload: {
        type: 'dynamic-execute',
        data: query,
      },
    });
  }

  /**
   * Execute a saved query
   *
   * @param savedQuery
   * @returns
   */
  public async savedQuery(
    // @todo the proper type here is unclear  - we need to make clear how the user needs to call this
    savedQuery: LogscaleRequestMessage['payload']['data'],
  ) {
    return this.falcon.bridge.postMessage<LogscaleRequestMessage>({
      type: 'loggingapi',
      payload: {
        type: 'saved-query-execute',
        data: savedQuery,
      },
    });
  }
}
