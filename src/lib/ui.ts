import type { Bridge } from '../bridge';
import type {
  ExtensionIdentifier,
  LocalData,
  OpenModalOptions,
} from '../types';

export class UI<DATA extends LocalData = LocalData> {
  constructor(private bridge: Bridge<DATA>) {}

  public async openModal<PAYLOAD = unknown>(
    extension: ExtensionIdentifier,
    title: string,
    options: OpenModalOptions = {},
  ): Promise<PAYLOAD> {
    const result = await this.bridge.postMessage({
      type: 'openModal',
      payload: {
        extension,
        title,
        options,
      },
    });

    if (result instanceof Error) {
      throw result;
    }

    return result;
  }

  public closeModal<PAYLOAD = unknown>(payload?: PAYLOAD) {
    this.bridge.sendUnidirectionalMessage({
      type: 'closeModal',
      payload,
    });
  }
}
