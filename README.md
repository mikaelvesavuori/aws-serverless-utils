# aws-serverless-utils

**Utility functions for AWS serverless services like Lambda, EventBridge, and DynamoDB.**

![Build Status](https://github.com/mikaelvesavuori/aws-serverless-utils/workflows/main/badge.svg)

Serverless is awesome but what happens when you have a ton of microservices and small APIs? Well, you replicate the same boring boilerplate everywhere, that's what happens! This packages resolves some of those issues.

- Saves you time when building AWS serverless solutions
- Sensible helpers for common boilerplate boring stuff
- Lightweight
- Zero dependencies
- Has 100% test coverage

## Usage

### Basic importing and usage

The basic pattern is to import each function you want to use, respectively, and then use them.

```typescript
// ES5 format
const { end } = require('aws-serverless-utils');
// ES6 format
import { end } from 'aws-serverless-utils';

// One example could be...
return end(); // Returns a 201 with no message and CORS headers
```

## Functions

### `end()`

Utility function to create a valid AWS Lambda response object. Note that headers will be completely replaced if you supply custom headers.

```ts
return end(); // Returns a 201 with no message and CORS headers
return end(204); // Returns a 204 with no message and CORS headers
return end(200, { timeCreated: '2024-10-27', itemId: 'abc123' }); // Returns a 200 with an object message
return end(200, null, { 'X-Custom-Header': 'custom-value' }); // Replaces the headers with a custom set of headers
```

### `getAuthData()`

Get the authorization data coming from the Lambda authorizer.

```ts
export async function handler(event, context) {
  const authData = getAuthData(event); // Get any data from the Lambda authorizer.
}
```

### `getCleanedDynamoItems()`

Clean up and return DynamoDB items in a normalized format. Accepts one or multiple items and returns an array of cleaned objects. Returns a cleaned and parsed array of objects.

The optional `includePkSk` (set to false by default) will enable getting the `pk` and `sk` keys.

```ts
const items = getCleanedDynamoItems(
  [
    {
      pk: { S: 'item#123' },
      sk: { S: 'meta#456' },
      name: { S: 'Test Item' },
      age: { N: '25' },
      isActive: { BOOL: true },
      tags: { SS: ['tag1', 'tag2'] },
      metadata: { M: { key1: { S: 'value1' }, key2: { N: '100' } } },
      list: { L: [{ S: 'item1' }, { S: 'item2' }] }
    }
  ],
  true // This will return the pk and sk values, else they are omitted
);

// This is what items will look like
const result = {
  pk: 'item#123',
  sk: 'meta#456',
  name: 'Test Item',
  age: 25,
  isActive: true,
  tags: ['tag1', 'tag2'],
  metadata: { key1: 'value1', key2: 100 },
  list: ['item1', 'item2']
};
```

### `getInputBody()`

Get the main input body from EventBridge or API Gateway input, in which case it also handles if the input is stringified JSON.

If you follow the convention with `data` + `metadata` in EventBridge, then the `data` object will be returned, otherwise the whole `detail` object will be returned. It will also handle Base64-encoded bodies.

```ts
export async function handler(event, context) {
  const body = getInputBody(event);
  const result = {
    myThingHere: true // You'll get a ready-to-use JSON object
  };
}
```

### `getPathParameters()`

Get the `pathParameters` object if it exists, else an empty object.

```ts
export async function handler(event, context) {
  const body = getPathParameters(event);
  const result = {
    recordId: 'abc123' // You'll get a ready-to-use JSON object
  };
}
```

### `getQueryStringParameters()`

Get query string parameters if they exist, else an empty object.

```ts
export async function handler(event, context) {
  const body = getQueryStringParameters(event);
  const result = {
    isSpecialFeature: true // You'll get a ready-to-use JSON object
  };
}
```

### `handleCors()`

Return a CORS response.

```ts
export async function handler(event, context) {
  if (event?.requestContext?.http?.method === 'OPTIONS') return handleCors();
}
```

```json
{
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify('OK')
  }
```

### `isJsonString()`

Check if input is stringified JSON.

```ts
isJsonString('asdf'); // false
isJsonString('{"abc": 123}'); // true
```

### `mapToDynamoAttribute()`

Map out values as DynamoDB attributes. Use this to convert JSON to a shape ready to use with DynamoDB.

Supports mapping to:

- `NULL`
- `BOOL`
- `S`
- `N`
- `L`
- `M`

```ts
mapToDynamoAttribute({
  title: 'Complex Item',
  count: 5,
  isActive: true,
  tags: ['tag1', 'tag2'],
  metadata: {
    createdBy: 'user123',
    scores: [1, 2, 3],
    settings: { darkMode: false }
  }
});

// You'll get a result like this
const result = {
  M: {
    title: { S: 'Complex Item' },
    count: { N: '5' },
    isActive: { BOOL: true },
    tags: { L: [{ S: 'tag1' }, { S: 'tag2' }] },
    metadata: {
      M: {
        createdBy: { S: 'user123' },
        scores: { L: [{ N: '1' }, { N: '2' }, { N: '3' }] },
        settings: {
          M: {
            darkMode: { BOOL: false }
          }
        }
      }
    }
  }
};
```

## License

MIT. See `LICENSE` file.
