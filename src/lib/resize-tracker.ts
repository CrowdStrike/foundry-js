import type { Bridge } from '../bridge';
import type { LocalData } from '../types';

export class ResizeTracker<DATA extends LocalData = LocalData> {
  private observer: ResizeObserver;

  constructor(private bridge: Bridge<DATA>) {
    this.observer = new ResizeObserver((entries) => this.handleResizeEvent(entries));
    this.observer.observe(document.body);
  }

  private handleResizeEvent(entries: ResizeObserverEntry[]) {
    const { height } = entries[0].contentRect;

    this.bridge.sendUnidirectionalMessage({
      type: 'resize',
      payload: {
        height,
      },
    });
  }

  destroy() {
    this.observer.disconnect();
  }
}
