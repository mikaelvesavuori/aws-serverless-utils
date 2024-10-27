// Sample DynamoDB data for testing
export const dynamoItemSample: Record<string, any> = {
  pk: { S: 'item#123' },
  sk: { S: 'meta#456' },
  name: { S: 'Test Item' },
  age: { N: '25' },
  isActive: { BOOL: true },
  tags: { SS: ['tag1', 'tag2'] },
  metadata: { M: { key1: { S: 'value1' }, key2: { N: '100' } } },
  list: { L: [{ S: 'item1' }, { S: 'item2' }] }
};

// Expected result for cleaned data without pk/sk
export const expectedCleanedDataWithoutPkSk: Record<string, any> = {
  name: 'Test Item',
  age: 25,
  isActive: true,
  tags: ['tag1', 'tag2'],
  metadata: { key1: 'value1', key2: 100 },
  list: ['item1', 'item2']
};

// Expected result for cleaned data with pk/sk
export const expectedCleanedDataWithPkSk: Record<string, any> = {
  pk: 'item#123',
  sk: 'meta#456',
  ...expectedCleanedDataWithoutPkSk
};

// Sample data for testing JSON parsing and null handling
export const jsonStringSample = {
  pk: { S: 'item#123' },
  sk: { S: 'meta#456' },
  jsonString: { S: '{"key": "value"}' }, // JSON string that should be parsed
  malformedJsonString: { S: '{key: value' }, // Malformed JSON string that should not parse
  simpleString: { S: 'Just a string' } // Regular string that should remain unchanged
};

// Expected cleaned data result for JSON parsing tests
export const expectedParsedJsonResult = {
  jsonString: { key: 'value' }, // Parsed JSON object
  malformedJsonString: '{key: value', // Malformed JSON should remain a string
  simpleString: 'Just a string' // Regular string should remain unchanged
};
