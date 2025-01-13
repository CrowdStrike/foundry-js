# @crowdstrike/foundry-js

## 0.17.1

### Patch Changes

- [#75](https://github.com/CrowdStrike/foundry-js/pull/75) [`aa135d6`](https://github.com/CrowdStrike/foundry-js/commit/aa135d6ca45e6dc3501c5d815ef1c64592aba14f) Thanks [@cs-ade-adesokan](https://github.com/cs-ade-adesokan)! - Added list method to collections

## 0.17.0

### Minor Changes

- [#73](https://github.com/CrowdStrike/foundry-js/pull/73) [`804f1fe`](https://github.com/CrowdStrike/foundry-js/commit/804f1fe41c8e56ef397a829a0ad106e3c64c2ba3) Thanks [@cs-ade-adesokan](https://github.com/cs-ade-adesokan)! - Added upgraded alerts api methods
  - deprecated `getQueriesAlertsV1` and added `getQueriesAlertsV2`to be used in its place.
  - deprecated `patchCombinedAlertsV2` and added `patchCombinedAlertsV3`to be used in its place.
  - deprecated `patchEntitiesAlertsV2` and added `patchEntitiesAlertsV3`to be used in its place.
  - deprecated `postAggregatesAlertsV1` and added `postAggregatesAlertsV2`to be used in its place.
  - deprecated `postEntitiesAlertsV1` and added `postEntitiesAlertsV2`to be used in its place.

## 0.16.0

### Minor Changes

- [#70](https://github.com/CrowdStrike/foundry-js/pull/70) [`0550a4e`](https://github.com/CrowdStrike/foundry-js/commit/0550a4e3a294d2e3b1a1e41f20d922f29b233a1d) Thanks [@rlucha-crowdstrike](https://github.com/rlucha-crowdstrike)! - Enforce mandatory definitionID for API Integration calls

## 0.15.0

### Minor Changes

- [#66](https://github.com/CrowdStrike/foundry-js/pull/66) [`6dffedd`](https://github.com/CrowdStrike/foundry-js/commit/6dffeddb0faa344028a182d487b72e35e13920fb) Thanks [@rhinchey-cs](https://github.com/rhinchey-cs)! - return initial data from connect()

## 0.14.0

### Minor Changes

- [#63](https://github.com/CrowdStrike/foundry-js/pull/63) [`80aa395`](https://github.com/CrowdStrike/foundry-js/commit/80aa3952de0ec18b7ccf5b8b531047553108571b) Thanks [@rhinchey-cs](https://github.com/rhinchey-cs)! - Adding new methods to plugins and logging apis

## 0.13.0

### Minor Changes

- [#60](https://github.com/CrowdStrike/foundry-js/pull/60) [`70f1700`](https://github.com/CrowdStrike/foundry-js/commit/70f1700ced5a19f56398a735a12c4b2cf362565b) Thanks [@RuslanZavacky](https://github.com/RuslanZavacky)! - Update packages, adapt code & tests for new versions.

## 0.12.1

### Patch Changes

- [#58](https://github.com/CrowdStrike/foundry-js/pull/58) [`3d05e29`](https://github.com/CrowdStrike/foundry-js/commit/3d05e29a536efc186ce0a5ee4e180505ab367520) Thanks [@RuslanZavacky](https://github.com/RuslanZavacky)! - Added code of conduct

## 0.12.0

### Minor Changes

- [#55](https://github.com/CrowdStrike/foundry-js/pull/55) [`4fb9b96`](https://github.com/CrowdStrike/foundry-js/commit/4fb9b965975d9392788e2bf2b310bc116d53de0e) Thanks [@RuslanZavacky](https://github.com/RuslanZavacky)! - Connect message can be undefined, if app runs without iframe. If that happens, we'll gracefully ignore failure and allow application to continue to work.

## 0.11.0

### Minor Changes

- [#53](https://github.com/CrowdStrike/foundry-js/pull/53) [`2000545`](https://github.com/CrowdStrike/foundry-js/commit/200054522811b9a22164f288e10a8dfb0909a9c9) Thanks [@RuslanZavacky](https://github.com/RuslanZavacky)! - Improve how we handle onClick for navigation. Now when adding event listener to click event:

  ```javascript
  document
    .querySelector('[data-internal-links]')
    .addEventListener('click', (event) =>
      falcon.navigation.onClick(event, '_self', 'internal'),
    );
  ```

  we'll call preventDefault correctly and won't throw error in the console.

## 0.10.1

### Patch Changes

- [#51](https://github.com/CrowdStrike/foundry-js/pull/51) [`4d60e65`](https://github.com/CrowdStrike/foundry-js/commit/4d60e650035f390d5d8818cabba71ca157bf81e1) Thanks [@simonihmig](https://github.com/simonihmig)! - Expose permissions map as local data

## 0.10.0

### Minor Changes

- [#49](https://github.com/CrowdStrike/foundry-js/pull/49) [`0cbf06a`](https://github.com/CrowdStrike/foundry-js/commit/0cbf06aa95300ea1fc86313ca0788c7035440239) Thanks [@RuslanZavacky](https://github.com/RuslanZavacky)! - \* Use `getIntelMitreEntitiesMatrixV1` instead of `getEntitiesMatrixV1`
  - Updated available APIs

## 0.9.0

### Minor Changes

- [#45](https://github.com/CrowdStrike/foundry-js/pull/45) [`3d15b8f`](https://github.com/CrowdStrike/foundry-js/commit/3d15b8f0aea84f27b14fe05e9c2af3670d46377b) Thanks [@simonihmig](https://github.com/simonihmig)! - [BREAKING] Refactor namespaces for consistency

  This change moves the Cloud APIs, which were previously accessed directly from the `FalconAPI` instance, to their own `.api` namespace.

  To migrate:

  ```js
  // before:
  falcon.incidents.getQueriesIncidentsV1();

  // after:
  falcon.api.incidents.getQueriesIncidentsV1();
  ```

  Furthermore, the `uploadFile()` function has been moved into the existing `.ui` namespace.

  To migrate:

  ```js
  // before:
  falcon.uploadFile('remote-response');

  // after:
  falcon.ui.uploadFile('remote-response');
  ```

## 0.8.2

### Patch Changes

- [#42](https://github.com/CrowdStrike/foundry-js/pull/42) [`6a1aee3`](https://github.com/CrowdStrike/foundry-js/commit/6a1aee3c7aacb988a359f3c934a26ca20b71da00) Thanks [@PaulRosset](https://github.com/PaulRosset)! - Add additional endpoints for handling File Upload GET/DELETE

## 0.8.1

### Patch Changes

- [#40](https://github.com/CrowdStrike/foundry-js/pull/40) [`14f4a85`](https://github.com/CrowdStrike/foundry-js/commit/14f4a850fe5f4fe9916901b2ad1d2cacfce13c8d) Thanks [@nelstrom](https://github.com/nelstrom)! - Expose the getQueriesDevicesV1 endpoint from the devices API

## 0.8.0

### Minor Changes

- [#36](https://github.com/CrowdStrike/foundry-js/pull/36) [`df231a5`](https://github.com/CrowdStrike/foundry-js/commit/df231a559c8ab204bdd9aa4b2cb1099d5896e563) Thanks [@RuslanZavacky](https://github.com/RuslanZavacky)! - \* To initialize CloudFunction abstraction, we can pass id + version (optional) or name + version (optional).
  Latter will be the default way forward - name + version:

  ```javascript
  const cloudFunction = falcon.cloudFunction({
    name: 'my-function-name',
    version: 6,
  });
  ```

  - How we pass query and header to the cloud function is changing.

  ```javascript
  const postResponse = await cloudFunction
    .path('/actions')
    .post(
      { action: 'ok' },
      { query: { param1: 'value1' }, header: { header1: 'value1' } },
    );
  ```

  - Collections: `search` method definition updated to match API improvements
  - LogScale: added `savedSearch` method to execute saved searches
  - App ID will be passed with initial data and will be automatically appended in places where it is required
  - Updated APIs endpoints for Collections and RTR

## 0.7.3

### Patch Changes

- [#34](https://github.com/CrowdStrike/foundry-js/pull/34) [`be06ec3`](https://github.com/CrowdStrike/foundry-js/commit/be06ec3400dc335b92249f741f72c6b40d467aba) Thanks [@ysvahn](https://github.com/ysvahn)! - Exposing User Management API (GET)

## 0.7.2

### Patch Changes

- [#32](https://github.com/CrowdStrike/foundry-js/pull/32) [`fd4c415`](https://github.com/CrowdStrike/foundry-js/commit/fd4c4152bf253d77644e8ca96efba4d578aa95c4) Thanks [@simonihmig](https://github.com/simonihmig)! - Add user data to local data

  We now pass the user's uuid and username as local data to extensions

## 0.7.1

### Patch Changes

- [#30](https://github.com/CrowdStrike/foundry-js/pull/30) [`412d2e5`](https://github.com/CrowdStrike/foundry-js/commit/412d2e5e3f7fa294551029f7dc52ccaab699a90d) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix RTR put-files endpoint

## 0.7.0

### Minor Changes

- [#28](https://github.com/CrowdStrike/foundry-js/pull/28) [`6363ec2`](https://github.com/CrowdStrike/foundry-js/commit/6363ec2c5a2eb02b4b132d4313a6ea16c351853a) Thanks [@simonihmig](https://github.com/simonihmig)! - Update put-files endpoints

### Patch Changes

- [#26](https://github.com/CrowdStrike/foundry-js/pull/26) [`946c3a1`](https://github.com/CrowdStrike/foundry-js/commit/946c3a1e7dc8898fa76dac6535841f87af45286c) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix return type of `bridge.postMessage()` using proper `ResponseFor` type

## 0.6.1

### Patch Changes

- [#24](https://github.com/CrowdStrike/foundry-js/pull/24) [`d05b45e`](https://github.com/CrowdStrike/foundry-js/commit/d05b45e31e016edf09d80d25f5aa7b4fda808cc5) Thanks [@simonihmig](https://github.com/simonihmig)! - Add RTR app API endpoints

## 0.6.0

### Minor Changes

- [#20](https://github.com/CrowdStrike/foundry-js/pull/20) [`3e7d79e`](https://github.com/CrowdStrike/foundry-js/commit/3e7d79e67d1b3ec9169be918b8c110f2001d9d88) Thanks [@PaulRosset](https://github.com/PaulRosset)! - Add the ability to perform PUT request for Cloud functions

### Patch Changes

- [#22](https://github.com/CrowdStrike/foundry-js/pull/22) [`4344a0e`](https://github.com/CrowdStrike/foundry-js/commit/4344a0efa818d5c4cc41dac28987856b57c85637) Thanks [@PaulRosset](https://github.com/PaulRosset)! - Fix path chained method with the correct dedicated function call

## 0.5.1

### Patch Changes

- [#18](https://github.com/CrowdStrike/foundry-js/pull/18) [`d8a515a`](https://github.com/CrowdStrike/foundry-js/commit/d8a515a749a7e37dfe060509cea8ba94fa328170) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix package.json exports for API types

  For types, we want to allow importing from e.g. `/apis/workflows`, which should map to `/dist/apis/workflows/index.d.ts` (note the implicit index module). For real runtime imports, we still only allow importing from index, i.e. `@crowdstrike/foundry-js`.

## 0.5.0

### Minor Changes

- [#16](https://github.com/CrowdStrike/foundry-js/pull/16) [`c5668ca`](https://github.com/CrowdStrike/foundry-js/commit/c5668ca95ca69efec996036627d7e779ecd3e474) Thanks [@simonihmig](https://github.com/simonihmig)! - Update SDK with all internal changes
