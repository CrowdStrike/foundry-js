import type FalconApi from '../api';
import type { LocalData } from '../types';
import type { NavigateToRequestMessage } from '../types';

const ALLOWED_TARGETS = ['_self', '_blank'] as const;

export class Navigation<DATA extends LocalData = LocalData> {
  constructor(private readonly falcon: FalconApi<DATA>) {}

  public async navigateTo({
    path,
    type,
    target,
    metaKey,
    ctrlKey,
    shiftKey,
  }: {
    path: string;
    target?: NavigateToRequestMessage['payload']['target'];
    type?: NavigateToRequestMessage['payload']['type'];
    metaKey?: boolean;
    ctrlKey?: boolean;
    shiftKey?: boolean;
  }) {
    await this.falcon.bridge.postMessage<NavigateToRequestMessage>({
      type: 'navigateTo',
      payload: {
        path,
        type: type ?? 'falcon',
        target: target ?? '_self',
        metaKey: metaKey ?? false,
        ctrlKey: ctrlKey ?? false,
        shiftKey: shiftKey ?? false,
      },
    });
  }

  public async onClick(
    event: MouseEvent | KeyboardEvent,
    defaultTarget: (typeof ALLOWED_TARGETS)[number] = '_self',
    defaultType: NavigateToRequestMessage['payload']['type'] = 'falcon'
  ) {
    if (!(event instanceof Event)) {
      throw Error('"event" property should be subclass of Event');
    }

    if (!('preventDefault' in event)) {
      return;
    }

    event.preventDefault();

    if (!(event.target instanceof HTMLAnchorElement)) {
      throw Error(`event target is not an anchor element, ${event.target}`);
    }

    const path = event.target.getAttribute('href');
    defaultTarget =
      (event.target.getAttribute('target') as '_self' | '_blank') ??
      defaultTarget;
    const type = (event.target.dataset?.type ??
      defaultType) as NavigateToRequestMessage['payload']['type'];

    if (
      defaultTarget === null ||
      !ALLOWED_TARGETS.includes(
        defaultTarget as (typeof ALLOWED_TARGETS)[number]
      )
    ) {
      throw new Error('Target should be _self or _blank');
    }

    const target = defaultTarget as (typeof ALLOWED_TARGETS)[number];

    if (path === undefined || path === null) {
      throw new Error(
        'Navigation path is missing. Make sure you have added navigation.onClick on the `a` tag and `href` is present.'
      );
    }

    const { metaKey, ctrlKey, shiftKey } = event;

    await this.navigateTo({ path, type, target, metaKey, ctrlKey, shiftKey });
  }
}
