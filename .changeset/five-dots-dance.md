---
'@crowdstrike/foundry-js': patch
---

Fix package.json exports for API types

For types, we want to allow importing from e.g. `/apis/workflows`, which should map to `/dist/apis/workflows/index.d.ts` (note the implicit index module). For real runtime imports, we still only allow importing from index, i.e. `@crowdstrike/foundry-js`.
