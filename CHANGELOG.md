# @crowdstrike/foundry-js

## 0.5.1

### Patch Changes

- [#18](https://github.com/CrowdStrike/foundry-js/pull/18) [`d8a515a`](https://github.com/CrowdStrike/foundry-js/commit/d8a515a749a7e37dfe060509cea8ba94fa328170) Thanks [@simonihmig](https://github.com/simonihmig)! - Fix package.json exports for API types

  For types, we want to allow importing from e.g. `/apis/workflows`, which should map to `/dist/apis/workflows/index.d.ts` (note the implicit index module). For real runtime imports, we still only allow importing from index, i.e. `@crowdstrike/foundry-js`.

## 0.5.0

### Minor Changes

- [#16](https://github.com/CrowdStrike/foundry-js/pull/16) [`c5668ca`](https://github.com/CrowdStrike/foundry-js/commit/c5668ca95ca69efec996036627d7e779ecd3e474) Thanks [@simonihmig](https://github.com/simonihmig)! - Update SDK with all internal changes
