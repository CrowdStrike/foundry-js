import type FalconApi from '../api';
import type { LocalData, LogscaleRequestMessage } from '../types';

interface WriteProperties {
  tag: LogscaleRequestMessage['payload']['tag'];
  tagSource: LogscaleRequestMessage['payload']['tagSource'];
  testData: LogscaleRequestMessage['payload']['testData'];
}

export class Logscale<DATA extends LocalData = LocalData> {
  constructor(private readonly falcon: FalconApi<DATA>) {}

  public async write(data: LogscaleRequestMessage['payload']['data'], properties: WriteProperties) {
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

  public async query(data: LogscaleRequestMessage['payload']['data']) {
    return this.falcon.bridge.postMessage<LogscaleRequestMessage>({
      type: 'loggingapi',
      payload: {
        type: 'dynamic-execute',
        data,
      },
    });
  }
}
