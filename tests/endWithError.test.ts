import { expect, test } from 'vitest';

import { endWithError } from '../src/functions/endWithError.js';

test('It should use the default status code', () => {
  const expected = 400;
  const result = endWithError({}).statusCode;
  expect(result).toBe(expected);
});

test('It should use a custom default status code', () => {
  const expected = 500;
  const result = endWithError({}, expected).statusCode;
  expect(result).toBe(expected);
});

test('It should set the status code from the error', () => {
  const expected = 429;
  const result = endWithError({ cause: { statusCode: expected } }).statusCode;
  expect(result).toBe(expected);
});
