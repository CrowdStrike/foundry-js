![@crowdstrike/foundry-js](https://raw.githubusercontent.com/CrowdStrike/falconpy/main/docs/asset/cs-logo.png)

# @crowdstrike/foundry-js

The `foundry-js` JavaScript library provides convenient access to CrowdStrike's Foundry API for authoring UI pages and extensions.

## Installation

```sh
npm install @crowdstrike/foundry-js
# or
yarn add @crowdstrike/foundry-js
# or
pnpm add @crowdstrike/foundry-js
```

## Overview 🔎

This JavaScript SDK provides abstractions to build Foundry Pages, Extensions and interact with Foundry artifacts - Workflows, Collections, LogScale, API Integrations and CrowdStrike APIs.

## Usage

When an application starts, it should establish a connection to Falcon Console. If a connection is not established in first 5 seconds, the app or extension will be dropped from loading on the page.

```javascript
import FalconApi from '@crowdstrike/foundry-js';

async () => {
  const falcon = new FalconApi();

  await falcon.connect();
};
```

### Receiving events from Falcon Console

When a UI extension is loaded, it might receive data for the context it is loaded in. For example, if the UI extension was built for a Detection side panel, it will receive detection associated data.
If `data` is updated in Falcon Console - the event will automatically execute and pass the new data.

```javascript
async () => {
  falcon.events.on('data', (data) => {
    // store received `data` and use it inside your application
  });
};
```

The `data` object conforms to the `LocalData` [interface](./src/types.ts) and includes the following properties:

| Property        | Type                                 | Description                                                                                                                           |
| --------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `app.id`        | `string`                             | The ID of the app                                                                                                                     |
| `user.uuid`     | `string`                             | UUID of the signed-in user                                                                                                            |
| `user.username` | `string`                             | Username of the signed-in user                                                                                                        |
| `theme`         | `'theme-light' \| 'theme-dark'`      | Current theme in Falcon Console                                                                                                       |
| `cid`           | `string`                             | Current customer ID                                                                                                                   |
| `locale`        | `string`                             | Locale of the current user, e.g. `'en-us'`                                                                                            |
| `timezone`      | `string` (optional)                  | Timezone of the current user, e.g. `'America/New_York'`                                                                               |
| `dateFormat`    | `string` (optional)                  | Date format preferred by the user, in a [`moment.js` format](https://momentjs.com/docs/#/displaying/format/)                          |
| `parentUrl`     | `string` (optional)                  | URL of the Falcon Console page hosting this extension, excluding the protocol and hostname                                            |
| `permissions`   | `Record<string, boolean>` (optional) | Map of custom app permissions, where each key is a permission name and the value indicates whether it is granted for the current user |

### Working with Workflows

To call an on-demand workflow:

```javascript
async () => {
  const config = { name: 'WorkflowName', depth: 0 };

  const pendingResult = await falcon.api.workflows.postEntitiesExecuteV1(
    {},
    config,
  );

  const result = await falcon.api.workflows.getEntitiesExecutionResultsV1({
    ids: triggerResult.resources[0],
  });
};
```

### Working with Collections

```javascript
async () => {
  const sampleData = {
    name: 'John',
    age: 42,
    aliases: ['Doe', 'Foundry'],
  };

  const collection = falcon.collection({ collection: '<collectionName>' });

  // Write to a collection
  const result = await collection.write('test-key', sampleData);

  // Read from a collection
  const record = await collection.read('test-key');
  // record.age === 42

  // Search a collection
  // NOTE: `filter` does NOT use FQL (Falcon Query Language). An exact match for the name has to be used in this example below.
  const searchResult = await collection.search({
    filter: `name:'exact-name-value'`,
  });

  // List the object keys in the collection
  // NOTE: Pagination is supported using; `start`, `end` and `limit`.
  const listResult = await collection.list({ start, end, limit });

  // Delete a record
  const deleteResponse = await collection.delete('test-key');
};
```

### Working with LogScale

```javascript
async () => {
  // Write to LogScale
  const writeResult = await falcon.logscale.write({ test: 'check' });
  // writeResult.resources?.[0]?.rows_written === 1

  // Run a dynamic query
  const queryResult = await falcon.logscale.query({
    search_query: '*',
    start: '1h',
  });
  // queryResult.resources?.[0]?.event_count > 0

  // Run a saved query
  const savedQueryResult = await falcon.logscale.savedQuery({
    id: '<savedQueryId>',
    start: '30d',
    mode: 'sync',
  });
  // savedQueryResult.resources?.[0]?.event_count > 0
};
```

### Working with API Integration

To call API Integration, the App should be initially provisioned, and configuration for API Integration should be set up.

```javascript
async () => {
  // The following assumes that an API Integration was created and the operation 'Get Cities' exists
  const apiIntegration = falcon.apiIntegration({
    definitionId: '<api-integration-id from manifest.yml>',
    operationId: 'Get Cities',
  });

  const response = await apiIntegration.execute({
    request: {
      params: {
        path: {
          country: 'Spain',
        },
      },
    },
  });
  // response.resources?.[0]?.status_code === 200
  // Date is at response.resources[0].response_body
};
```

### Working with Cloud Functions

```javascript
async () => {
  const config = {
    name: 'CloudFunctionName',
    version: 1,
  };

  const cloudFunction = falcon.cloudFunction(config);

  // You can specify path parameters that will be passsed to your Cloud Function.
  // `id` and `mode` - example query params that your Cloud Function will receive
  const getResponse = await cloudFunction.path('/?id=150&mode=compact').get();

  // You can call different HTTP methods - GET, POST, PATCH, PUT, DELETE
  const postResponse = await cloudFunction.path('/').post({ name: 'test' });

  const patchResponse = cloudFunction.path('/').patch({ name: 'test' });

  const putResponse = cloudFunction.path('/').put({ name: 'test' });

  const deleteResponse = cloudFunction.path('/?id=100').delete();
};
```

### Working with AgentWorks

To invoke an AgentWorks agent and stream its response, call `falcon.agentWorks.invoke()` with the agent ID and any parameters. It will return an `AgentStream` that emits `data` chunks as they arrive, followed by a terminal `end` or `error`.

```javascript
const stream = falcon.agentWorks.invoke('<agent-id>', {
  prompt: 'Summarize this detection',
});

// Receive each chunk as it streams in
stream.on('data', (chunk) => {
  // Append chunk to your UI
});

// The stream completed successfully
stream.on('end', () => {
  // Finalize output
});

// The stream terminated with an error
stream.on('error', (err) => {
  // Handle err.message
});

// Cancel an in-flight stream early
stream.abort();
```

### Navigation utilities

As the Page or UI extension will run inside a sandboxed iframe, the `navigateTo` method must be used to change the URL of the parent context (Falcon Console).

The `parentUrl` property on the `data` object (see [Receiving events from Falcon Console](#receiving-events-from-falcon-console)) provides the current URL of the Falcon Console page hosting the extension (excluding the protocol and hostname). This can be useful as context when constructing navigation paths and reacting to navigation changes.

To open an external URL (in a new tab):

```javascript
falcon.navigation.navigateTo({
  path: 'https://www.github.com',
});
```

To navigate to a new URL within Falcon Console:

```javascript
falcon.navigation.navigateTo({
  path: '/login',
  type: 'falcon',
});
```

### Modal utility

To open a modal within Falcon Console and render a UI extension of your choice:

```javascript
const result = await api.ui.openModal(
  {
    id: '<extension ID as defined in the manifest>',
    type: 'extension', // 'extension' | 'page'
  },
  'Modal title',
  {
    path: '/', // Initial path that will be set when page or extension loads
    data: { foo: 'bar' }, // Data to pass to the modal
    size: 'lg', // Width of the modal - 'sm', 'md', 'lg', 'xl'. 'md' is default
    align: 'top', // Vertical alignment - 'top' or undefined
  }, // OpenModalOptions
);

// To close the modal:
await api.ui.closeModal();

await api.ui.closeModal({ foo: 'bar' }); // You can pass payload
```

## Sample apps

| Application                                                                       | Framework |
| --------------------------------------------------------------------------------- | --------- |
| [ Triage with MITRE Attack ](https://github.com/CrowdStrike/foundry-sample-mitre) | Vue       |
| [ Scalable RTR ](https://github.com/CrowdStrike/foundry-sample-scalable-rtr)      | React     |
| [ Rapid Response ](https://github.com/CrowdStrike/foundry-sample-rapid-response)  | React     |

## Additional resources

|                                                                                          | Description                                                                                   |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [ Javascript Blueprint ](https://github.com/CrowdStrike/foundry-js-blueprint-javascript) | Starter Javascript blueprint used in Foundry CLI                                              |
| [ React Blueprint ](https://github.com/CrowdStrike/foundry-js-blueprint-react)           | Starter React blueprint used in Foundry CLI                                                   |
| [Falcon Shoelace](https://github.com/CrowdStrike/falcon-shoelace)                        | [Shoelace Library](https://shoelace.style/) of web components styled to fit in Falcon Console |
