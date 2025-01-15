import { describe, expect, test } from 'vitest';

import { end } from '../src/functions/end.js';

const defaultHeaders = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'text/plain',
};

const getResponse = (
  statusCode = 200,
  body = undefined,
): Record<string, any> => {
  return {
    body,
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain',
    },
    statusCode,
  };
};

describe('Responses', async () => {
  test('It should respond with a 201 when provided no values', async () => {
    const result = await end();
    expect(result).toMatchObject(getResponse());
  });

  test('It should respond with a user-provided code when one is provided', async () => {
    const result = await end(204);
    expect(result).toMatchObject(getResponse(204));
  });

  test('It should handle string bodies', async () => {
    const response = getResponse(200);
    response.body = 'OK';
    response.headers['Content-Type'] = 'text/plain';
    const result = await end(200, 'OK');
    expect(result).toMatchObject(response);
  });

  test('It should handle number bodies', async () => {
    const response = getResponse(204);
    response.body = '9823916';
    response.headers['Content-Type'] = 'text/plain';
    const result = await end(204, 9823916);
    expect(result).toMatchObject(response);
  });

  test('It should handle object bodies', async () => {
    const response = getResponse(200);
    response.body = '{"timeCreated":"2024-10-27","itemId":"abc123"}';
    response.headers['Content-Type'] = 'application/json';
    const result = await end(200, {
      timeCreated: '2024-10-27',
      itemId: 'abc123',
    });
    expect(result).toMatchObject(response);
  });
});

describe('State', () => {
  test('It should wipe the CORRELATION_ID process variable when done', () => {
    process.env.CORRELATION_ID = 'XXXXXX';
    end();
    const result = process.env.CORRELATION_ID;
    expect(result).toBe('');
  });
});

describe('Headers', () => {
  test('It should use the default headers', async () => {
    const result = await end(200);
    expect(result.headers).toMatchObject(defaultHeaders);
  });

  test('It should allow custom headers', async () => {
    const input = { 'X-Custom-Header': 'custom-value' };
    const result = await end(200, null, input);
    expect(result.headers).toMatchObject(input);
  });
});
