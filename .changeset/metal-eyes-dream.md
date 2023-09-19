---
'@crowdstrike/foundry-js': minor
---

[BREAKING] Refactor namespaces for consistency

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
