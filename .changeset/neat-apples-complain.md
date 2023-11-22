---
'@crowdstrike/foundry-js': minor
---

Connect message can be undefined, if app runs without iframe. If that happens, we'll gracefully ignore failure and allow application to continue to work.
