import { test, describe, expect } from 'vitest';

import { mapToDynamoAttribute } from '../src/functions/mapToDynamoAttribute.js';

describe('Map to Dynamo attribute', () => {
  test('It should convert a string to DynamoDB format', () => {
    expect(mapToDynamoAttribute('Test String')).toEqual({ S: 'Test String' });
  });

  test('It should convert a number to DynamoDB format', () => {
    expect(mapToDynamoAttribute(123)).toEqual({ N: '123' });
  });

  test('It should convert a boolean to DynamoDB format', () => {
    expect(mapToDynamoAttribute(true)).toEqual({ BOOL: true });
  });

  test('It should convert null to DynamoDB format', () => {
    expect(mapToDynamoAttribute(null)).toEqual({ NULL: true });
  });

  test('It should convert an array to DynamoDB format with recursive mapping', () => {
    const inputArray = ['string', 42, false];
    const expectedOutput = {
      L: [{ S: 'string' }, { N: '42' }, { BOOL: false }]
    };
    expect(mapToDynamoAttribute(inputArray)).toEqual(expectedOutput);
  });

  test('It should convert a nested object to DynamoDB format with recursive mapping', () => {
    const inputObject = {
      key1: 'value',
      key2: 99,
      key3: { nestedKey: 'nestedValue' }
    };

    const expectedOutput = {
      M: {
        key1: { S: 'value' },
        key2: { N: '99' },
        key3: {
          M: {
            nestedKey: { S: 'nestedValue' }
          }
        }
      }
    };

    expect(mapToDynamoAttribute(inputObject)).toEqual(expectedOutput);
  });

  test('It should handle a complex structure with mixed types', () => {
    const complexStructure = {
      title: 'Complex Item',
      count: 5,
      isActive: true,
      tags: ['tag1', 'tag2'],
      metadata: {
        createdBy: 'user123',
        scores: [1, 2, 3],
        settings: { darkMode: false }
      }
    };

    const expectedOutput = {
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

    expect(mapToDynamoAttribute(complexStructure)).toEqual(expectedOutput);
  });
});

describe('Fallback null handling', () => {
  test('It should convert null to { NULL: true }', () => {
    expect(mapToDynamoAttribute(null)).toEqual({ NULL: true });
  });

  test('It should convert undefined to { NULL: true }', () => {
    expect(mapToDynamoAttribute(undefined)).toEqual({ NULL: true });
  });

  test('It should convert unsupported types (like a function) to { NULL: true }', () => {
    const unsupportedFunction = () => { }; // Example of unsupported type
    expect(mapToDynamoAttribute(unsupportedFunction)).toEqual({ NULL: true });
  });

  test('It should convert unsupported types (like a symbol) to { NULL: true }', () => {
    const unsupportedSymbol = Symbol('test');
    expect(mapToDynamoAttribute(unsupportedSymbol)).toEqual({ NULL: true });
  });
});
