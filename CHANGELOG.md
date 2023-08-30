# @crowdstrike/foundry-js

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
