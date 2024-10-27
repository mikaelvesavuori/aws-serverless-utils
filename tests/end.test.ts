import { test, describe, expect } from 'vitest';

import { end } from '../src/functions/end.js';

const defaultHeaders = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'text/plain'
};

const getResponse = (statusCode = 201, body = undefined): Record<string, any> => {
  return {
    body,
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain'
    },
    statusCode
  };
};

describe('Responses', () => {
  test('It should respond with a 201 when provided no values', () => {
    expect(end()).toMatchObject(getResponse());
  });

  test('It should respond with a user-provided code when one is provided', () => {
    expect(end(204)).toMatchObject(getResponse(204));
  });

  test('It should handle string bodies', () => {
    const response = getResponse(200);
    response.body = 'OK';
    response.headers['Content-Type'] = 'text/plain';
    expect(end(200, 'OK')).toMatchObject(response);
  });

  test('It should handle number bodies', () => {
    const response = getResponse(204);
    response.body = '9823916';
    response.headers['Content-Type'] = 'text/plain';
    expect(end(204, 9823916)).toMatchObject(response);
  });

  test('It should handle object bodies', () => {
    const response = getResponse(200);
    response.body = '{"timeCreated":"2024-10-27","itemId":"abc123"}';
    response.headers['Content-Type'] = 'application/json';
    expect(end(200, { timeCreated: '2024-10-27', itemId: 'abc123' })).toMatchObject(response);
  });
});

describe('Headers', () => {
  test('It should use the default headers', () => {
    expect(end(200).headers).toMatchObject(defaultHeaders);
  });

  test('It should allow custom headers', () => {
    const input = { 'X-Custom-Header': 'custom-value' };
    const result = end(200, null, input).headers;
    expect(result).toMatchObject(input);
  });
});
