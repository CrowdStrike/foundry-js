![@crowdstrike/foundry-js](https://raw.githubusercontent.com/CrowdStrike/falconpy/main/docs/asset/cs-logo.png)

# @crowdstrike/foundry-js

The `foundry-js` JavaScript library provides convenient access to CrowdStrike's Foundry API for authoring UI pages and extensions.

### Installation

```sh
npm install @crowdstrike/foundry-js
# or
yarn add @crowdstrike/foundry-js
# or
pnpm add @crowdstrike/foundry-js
```

## Overview 🔎

SDK provides abstractions to build Foundry Pages, Extensions and interact with Foundry artifacts - Workflows, Collections, LogScale, API Integrations and CrowdStrike APIs.

## Usage

When application starts, it should establish connection to Falcon Console. If connection is not establishes in first 5 seconds - app or extension will be dropped from loading on the page.

```javascript
import FalconApi from '@crowdstrike/foundry-js';

(async () => {
  const falcon = new FalconApi();
  
  await falcon.connect();
});
```

### Receive events from Falcon Console

When UI extensions is loaded, it might receive data for the context it is loaded, 
for example if UI extension was built for Detection side panel, it will receive detection associated data.
If `data` is updated in Falcon Console - event will automatically execute and pass new data.

```javascript
(async () => {
  falcon.events.on('data', (data) => {
    // store received `data` and use it inside your application
  });
});
```

### Working with Workflows

To call on-demand workflow:

```javascript
(async () => {
  const config = { name: 'WorkflowName', depth: 0 };

  const pendingResult = await falcon.api.workflows.postEntitiesExecuteV1({}, config);

  const result = await falcon.api.workflows.getEntitiesExecutionResultsV1({ ids: triggerResult.resources[0] });  
});
```

### Working with Collections

```javascript
(async () => {
  const sampleData = {
    "name": "John",
    "age": 42,
    "aliases": ["Doe", "Foundry"]
  };
  
  const collection = falcon
    .collection({collection: '<collectionName>' });

  // to write a collection
  const result = await collection.write('test-key', sampleData);

  // read collection
  const record = await collection.read('test-key');
  // record.age === 42
  
  // search collection, `filter` uses FQL (Falcon Query Language)
  const searchResult = await collection.search({ filter: `name:'*'` });
  
  // deletes record
  const deleteResponse = await collection.delete('test-key');
});
```

### Working with LogScale

```javascript
(async () => {
  // write to LogScale
  const writeResult = await falcon.logscale.write({ test: 'check' });
  // writeResult.resources?.[0]?.rows_written === 1
  
  // run dynamic query
  const queryResult = await falcon.logscale.query({ search_query: "*", start: "1h" });
  // queryResult.resources?.[0]?.event_count > 0
  
  // run saved query
  const savedQueryResult = await falcon.logscale.savedQuery({ id: "<savedQueryId>", start: "30d", mode: 'sync' });
  // savedQueryResult.resources?.[0]?.event_count > 0
});
```

### Working with API Integration

To call API Integration, App should be initially provisioned, and configuration for API Integration should be set up. 

```javascript
(async () => {
  // we assume, that API Integration was created and operation Get Cities exists
  
  const apiIntegration = falcon.apiIntegration({
    definitionId: '<api-integration-id from manifest.yml>',
    operationId: 'Get Cities',
  });

  const response = await apiIntegration.execute({
    request: {
      params: {
        path: {
          country: 'Spain'
        }
      }
    }
  });
  // response.resources?.[0]?.status_code === 200
  // date is at response.resources[0].response_body
});
```

### Working with Cloud Functions

```javascript
(async () => {
  const config = {
    name: 'CloudFunctionName',
    version: 1
  };
  
  const cloudFunction = falcon.cloudFunction(config);

  // you can specify path parameters that will be passsed to your Cloud Function. 
  // `id` and `mode` - example query params that your Cloud Function will receive 
  const getResponse = await cloudFunction.path('/?id=150&mode=compact')
    .get();

  // you can call different HTTP methods - GET, POST, PATCH, PUT, DELETE 
  const postResponse = await cloudFunction.path('/')
    .post({ name: 'test' });

  const patchResponse = cloudFunction.path('/')
    .patch({ name: 'test' });
  
  const putResponse = cloudFunction.path('/')
    .put({ name: 'test' });
  
  const deleteResponse = cloudFunction.path('/?id=100')
    .delete();
});
```

### Navigation utilities

As Page or UI extension will run inside sandboxed iframe, clicking links or navigating will be limited.
When browser URL changes, Foundry UI Page will receive that data via iframe hash change event.
You can listen to hash change event and process your app internal navigation. 

```javascript
window.addEventListener("hashchange", (event) => {
  let rawHash = new URL(event.newURL).hash;

  const path = rawHash.substring(1);
}, false);

// to read initial hash when your app loads:
const initialPath = document.location.hash.substring(1);
```

If you have links in your application, that point to the internal URLs of your application (for example navigation from /page-1 to /page-2) - 
you can add `data-` attribute to those links, and add onClick handler, that will handle navigation outside of iframe and will update iframe hash.

```javascript
// find all links with data attribute - `data-internal-link` 
document.querySelector('[data-internal-link]')
  .addEventListener('click', (event) => falcon.navigation.onClick(event, '_self', 'internal'));
```

If you have external links that you want to navigate to, for example www.crowdstrike.com, you can add `data-` attribute to identify those:

```javascript
// find all links with data attribute - `data-external-link` 
document.querySelector('[data-external-link]')
      .addEventListener('click', (event) => falcon.navigation.onClick(event));
```

### Modal utility

To open a modal within Falcon Console, rendering UI extension of your choice:

```javascript
const result = await api.ui.openModal(
  { 
    id: '<extension ID as defined in the manifest>', 
    type: 'extension' // 'extension' | 'page'
  },
  'Modal title', 
  {
    path: '/', // initial path that will be set when page or extension loads  
    data: { foo: 'bar' }, // data to pass to the modal
    size: 'lg', // width of the modal - 'sm', 'md', 'lg', 'xl'. 'md' is default
    align: 'top', // vertical alignment - 'top' or undefined
  } // OpenModalOptions
);

// to close modal:
await api.ui.closeModal();

await api.ui.closeModal({ foo: 'bar' });// you can pass payload
```

## Sample apps

| Application                                                                        | Framework |
|------------------------------------------------------------------------------------|-----------|
| [ Triage with MITRE Attack ](https://github.com/CrowdStrike/foundry-sample-mitre ) | Vue       |
| [ Scalable RTR ]( https://github.com/CrowdStrike/foundry-sample-scalable-rtr )     | React     |
| [ Rapid Response ]( https://github.com/CrowdStrike/foundry-sample-rapid-response ) | React     |

## Additionally

|                                                                                           | Description                                                                                   |
|-------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| [ Javascript Blueprint ](https://github.com/CrowdStrike/foundry-js-blueprint-javascript ) | Starter Javascript blueprint used in Foundry CLI                                              |
| [ React Blueprint ]( https://github.com/CrowdStrike/foundry-js-blueprint-react )          | Starter React blueprint used in Foundry CLI                                                   |
| [Falcon Shoelace](https://github.com/CrowdStrike/falcon-shoelace)                         | [Shoelace Library](https://shoelace.style/) of web components styled to fit in Falcon Console |


