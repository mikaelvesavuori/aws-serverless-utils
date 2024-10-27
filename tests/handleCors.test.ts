import { test, describe, expect } from 'vitest';

import { handleCors } from '../src/functions/handleCors.js';

describe('CORS handling', () => {
  const expected = {
    body: '"OK"',
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain'
    },
    statusCode: 200
  };

  test('It should return a CORS-handling object', () => {
    expect(handleCors()).toMatchObject(expected);
  });
});
