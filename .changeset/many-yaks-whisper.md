---
'@crowdstrike/foundry-js': minor
---

* To initialize CloudFunction abstraction, we can pass id + version (optional) or name + version (optional).  
  Latter will be the default way forward - name + version:

```javascript
const cloudFunction = falcon.cloudFunction({
  name: 'my-function-name',
  version: 6,
});
```

* How we pass query and header to the cloud function is changing.

```javascript
const postResponse = await cloudFunction.path('/actions')
      .post({ action: 'ok' }, { query: { param1: 'value1' }, header: { header1: 'value1' } });
```
* Collections: `search` method definition updated to match API improvements
* LogScale: added `savedSearch` method to execute saved searches
* App ID will be passed with initial data and will be automatically appended in places where it is required
* Updated APIs endpoints for Collections and RTR 
