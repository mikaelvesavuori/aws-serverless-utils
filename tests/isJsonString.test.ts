import { test, describe, expect } from 'vitest';

import { isJsonString } from '../src/functions/isJsonString.js';

describe('JSON string checking', () => {
  test('It should verify that a plain string is not JSON', () => {
    expect(isJsonString('asdf')).toBe(false);
  });

  test('It should verify that a stringified piece of JSON is indeed JSON', () => {
    expect(isJsonString('{"abc": 123}')).toBe(true);
  });
});
