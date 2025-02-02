import { expect, test } from 'vitest';

import { endWithError } from '../src/functions/endWithError.js';

test('It should use the default status code', async () => {
  const expected = 400;
  const result = await endWithError();
  expect(result.statusCode).toBe(expected);
});

test('It should use a custom default status code', async () => {
  const expected = 500;
  const result = await endWithError({ defaultErrorCode: expected });
  expect(result.statusCode).toBe(expected);
});

test('It should set the status code from the error', async () => {
  const expected = 429;
  const result = await endWithError({
    error: { cause: { statusCode: expected } },
  });
  expect(result.statusCode).toBe(expected);
});

test('It should use the error message of an Error object', async () => {
  const message = 'It went bam';
  const expected = 'Error: ' + message;
  const result = await endWithError({ error: new Error(message) });
  expect(result.body).toBe(expected);
});

test('It should use a literal string as the error message', async () => {
  const expected = 'Error: It went bam';
  const result = await endWithError({ error: expected });
  expect(result.body).toBe(expected);
});

test('It should set the message as an empty string if an error message is not provided or available', async () => {
  const expected = '';
  // @ts-ignore
  const result = await endWithError();
  expect(result.body).toBe(expected);
});
