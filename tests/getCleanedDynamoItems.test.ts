import { test, describe, expect } from 'vitest';

import {
  getCleanedDynamoItems,
  cleanDynamoData,
  extractDynamoValue
} from '../src/functions/getCleanedDynamoItems.js';

import {
  dynamoItemSample,
  expectedCleanedDataWithoutPkSk,
  expectedCleanedDataWithPkSk,
  jsonStringSample,
  expectedParsedJsonResult
} from '../testdata/dynamoTestData.js';

describe('Get cleaned Dynamo items', () => {
  test('It should return an empty array if there is no input', () => {
    // @ts-ignore
    const result = getCleanedDynamoItems();
    expect(result).toEqual([]);
  });

  test('It should clean and normalize a single DynamoDB item without pk/sk', () => {
    const result = getCleanedDynamoItems(dynamoItemSample);
    expect(result).toEqual([expectedCleanedDataWithoutPkSk]);
  });

  test('It should clean and normalize a single DynamoDB item with pk/sk', () => {
    const result = getCleanedDynamoItems(dynamoItemSample, true);
    expect(result).toEqual([expectedCleanedDataWithPkSk]);
  });

  test('It should clean and normalize multiple DynamoDB items', () => {
    const result = getCleanedDynamoItems([dynamoItemSample, dynamoItemSample], true);
    expect(result).toEqual([expectedCleanedDataWithPkSk, expectedCleanedDataWithPkSk]);
  });
});

describe('Clean Dynamo data', () => {
  test('It should clean and normalize DynamoDB item data without pk/sk', () => {
    const result = cleanDynamoData(dynamoItemSample);
    expect(result).toEqual(expectedCleanedDataWithoutPkSk);
  });

  test('It should clean and normalize DynamoDB item data with pk/sk', () => {
    const result = cleanDynamoData(dynamoItemSample, true);
    expect(result).toEqual(expectedCleanedDataWithPkSk);
  });

  describe('JSON parsing', () => {
    test('It should parse JSON strings to objects where possible', () => {
      const result = cleanDynamoData(jsonStringSample);
      expect(result).toMatchObject(expectedParsedJsonResult);
    });

    test('It should retain malformed JSON strings without throwing errors', () => {
      const result = cleanDynamoData(jsonStringSample);
      expect(result.malformedJsonString).toBe('{key: value');
    });

    test('It should keep non-JSON strings as is', () => {
      const result = cleanDynamoData(jsonStringSample);
      expect(result.simpleString).toBe('Just a string');
    });
  });
});

describe('Extract Dynamo values', () => {
  test('It should extract string values', () => {
    expect(extractDynamoValue({ S: 'string' })).toBe('string');
  });

  test('It should extract number values', () => {
    expect(extractDynamoValue({ N: '123' })).toBe(123);
  });

  test('It should extract boolean values', () => {
    expect(extractDynamoValue({ BOOL: true })).toBe(true);
  });

  test('It should extract list values', () => {
    expect(extractDynamoValue({ L: [{ S: 'item1' }, { S: 'item2' }] })).toEqual(['item1', 'item2']);
  });

  test('It should extract map values', () => {
    const mapValue = { M: { key1: { S: 'value1' }, key2: { N: '100' } } };
    expect(extractDynamoValue(mapValue)).toEqual({ key1: 'value1', key2: 100 });
  });

  test('It should return null for NULL values', () => {
    expect(extractDynamoValue({ NULL: true })).toBeNull();
  });

  test('It should return binary data as is for DynamoDB B (Binary) type', () => {
    const binaryData = new Uint8Array([1, 2, 3, 4]).buffer; // Example binary data
    expect(extractDynamoValue({ B: binaryData })).toBe(binaryData);
  });

  test('It should convert number set to an array of numbers for DynamoDB NS (Number Set) type', () => {
    const numberSet = { NS: ['1', '2', '3'] };
    expect(extractDynamoValue(numberSet)).toEqual([1, 2, 3]);
  });

  test('It should return binary set data as is for DynamoDB BS (Binary Set) type', () => {
    const binarySet = {
      BS: [new Uint8Array([1, 2, 3]).buffer, new Uint8Array([4, 5, 6]).buffer]
    };
    expect(extractDynamoValue(binarySet)).toEqual(binarySet.BS);
  });

  describe('Null handling', () => {
    test('It should return null for DynamoDB NULL values', () => {
      expect(extractDynamoValue({ NULL: true })).toBeNull();
    });

    test('It should return null for unsupported types (e.g., undefined values)', () => {
      expect(extractDynamoValue(undefined)).toBeNull();
    });

    test('It should return null for attributes that do not match any known DynamoDB type', () => {
      const unsupportedType = { UNKNOWN: 'unsupported' };
      expect(extractDynamoValue(unsupportedType)).toBeNull();
    });
  });
});
