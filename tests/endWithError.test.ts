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

test('It should use the error message of an Error object', () => {
  const expected = 'It went bam';
  const result = endWithError(new Error(expected)).body;
  expect(result).toBe(expected);
});

test('It should use a literal string as the error message', () => {
  const expected = 'It went bam';
  const result = endWithError(expected).body;
  expect(result).toBe(expected);
});

test('It should set the message as an empty string if an error message is not provided or available', () => {
  const expected = '';
  // @ts-ignore
  const result = endWithError().body;
  expect(result).toBe(expected);
});
