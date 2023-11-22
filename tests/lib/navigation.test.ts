import FalconApi from '../../src/';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import type { Navigation } from '../../src/lib/navigation';

import { connectApi, uuidV4Regex } from '../helpers';

let api: FalconApi;
let navigation: Navigation;

beforeEach(async () => {
  api = new FalconApi();
  window.parent = new Window();

  await connectApi(api);

  navigation = api.navigation;
});

afterEach(() => api.destroy());

test('it can be instantiated', () => {
  expect(navigation).toBeDefined();
});

test('it can navigate to the path', () => {
  const spy = vi.spyOn(window.parent, 'postMessage');

  navigation.navigateTo({ path: '/' });

  expect(spy).toHaveBeenCalledOnce();

  expect(spy.mock.lastCall?.[0]).toEqual(
    expect.objectContaining({
      message: {
        type: 'navigateTo',
        payload: {
          path: '/',
          target: '_self',
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          type: 'falcon',
        },
      },
      meta: {
        version: 'current',
        messageId: expect.stringMatching(uuidV4Regex),
      },
    }),
  );
});

test('onClick fails if MouseEvent not passed', async () => {
  const nonameClass = new (class {})();

  // resetting the types to see what happens when types are ignored and wrong event is passed
  await expect(async () =>
    navigation.onClick(nonameClass as unknown as MouseEvent),
  ).rejects.toThrowError(/subclass/);
});

test('onClick fails target element was not an anchor element', async () => {
  const spy = vi.spyOn(window.parent, 'postMessage');

  const mouseEventClass = new MouseEvent('click');

  navigation.onClick(mouseEventClass);

  expect(spy).not.toHaveBeenCalledOnce();
});

test('onClick fails with anchor element missing href attribute', async () => {
  const anchorElement = document.createElement('a');

  class SyntheticMouseEvent extends MouseEvent {
    target = anchorElement;
  }

  const mouseEventClass = new SyntheticMouseEvent('click');

  // resetting the types to see what happens when types are ignored and wrong event is passed
  await expect(async () =>
    navigation.onClick(mouseEventClass),
  ).rejects.toThrowError(
    /Navigation path is missing. Make sure you have added navigation.onClick on the `a` tag and `href` is present./,
  );
});

test('onClick triggers navigateTo message', async () => {
  const spy = vi.spyOn(window.parent, 'postMessage');

  const anchorElement = document.createElement('a');

  anchorElement.href = '/';

  class SyntheticMouseEvent extends MouseEvent {
    target = anchorElement;
  }

  const mouseEventClass = new SyntheticMouseEvent('click');

  navigation.onClick(mouseEventClass);

  expect(spy).toHaveBeenCalledOnce();

  expect(spy.mock.lastCall?.[0]).toEqual(
    expect.objectContaining({
      message: {
        type: 'navigateTo',
        payload: {
          path: '/',
          target: '_self',
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          type: 'falcon',
        },
      },
      meta: {
        version: 'current',
        messageId: expect.stringMatching(uuidV4Regex),
      },
    }),
  );
});

test('onClick triggers navigateTo message with query params for internal navigation', async () => {
  const spy = vi.spyOn(window.parent, 'postMessage');

  const anchorElement = document.createElement('a');

  anchorElement.href = '/?param1=value1';

  class SyntheticMouseEvent extends MouseEvent {
    target = anchorElement;
  }

  const mouseEventClass = new SyntheticMouseEvent('click');

  navigation.onClick(mouseEventClass);

  expect(spy).toHaveBeenCalledOnce();

  expect(spy.mock.lastCall?.[0]).toEqual(
    expect.objectContaining({
      message: {
        type: 'navigateTo',
        payload: {
          path: '/?param1=value1',
          target: '_self',
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          type: 'falcon',
        },
      },
      meta: {
        version: 'current',
        messageId: expect.stringMatching(uuidV4Regex),
      },
    }),
  );
});
