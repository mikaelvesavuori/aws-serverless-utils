import { test, describe, expect } from 'vitest';

import { getInputBody } from '../src/functions/getInputBody.js';

import apiGatewayV1 from '../testdata/ApiGatewayV1.json';
import apiGatewayV2 from '../testdata/ApiGatewayV2.json';
import eventBridgeEvent from '../testdata/EventBridgeEvent.json';

const expected = {
  organizationId: 'abc123',
  recordId: 'qwerty'
};

describe('Plain object body', () => {
  test('It should get the request body from an API Gateway V1 (REST API) object', () => {
    const input = JSON.parse(JSON.stringify(apiGatewayV1));
    input.body = expected;
    expect(getInputBody(input)).toMatchObject(expected);
  });

  test('It should get the request body from an API Gateway V2 (HTTP API) object', () => {
    const input = JSON.parse(JSON.stringify(apiGatewayV1));
    input.body = expected;
    expect(getInputBody(input)).toMatchObject(expected);
  });
});

describe('Stringified body', () => {
  test('It should get the request body from a stringified API Gateway V1 (REST API) object', () => {
    expect(getInputBody(apiGatewayV1)).toMatchObject(expected);
  });

  test('It should get the request body from a stringified API Gateway V2 (HTTP API) object', () => {
    expect(getInputBody(apiGatewayV2)).toMatchObject(expected);
  });

  test('It should get the request body from an EventBridge event object', () => {
    expect(getInputBody(eventBridgeEvent)).toMatchObject(expected);
  });
});

describe('Base64 encoded body', () => {
  test('It should decode and parse a Base64-encoded body from an API Gateway V1 (REST API) object', () => {
    const input = JSON.parse(JSON.stringify(apiGatewayV1));
    input.body = Buffer.from(JSON.stringify(expected)).toString('base64');
    input.isBase64Encoded = true;
    expect(getInputBody(input)).toMatchObject(expected);
  });

  test('It should decode and parse a Base64-encoded body from an API Gateway V2 (HTTP API) object', () => {
    const input = JSON.parse(JSON.stringify(apiGatewayV2));
    input.body = Buffer.from(JSON.stringify(expected)).toString('base64');
    input.isBase64Encoded = true;
    expect(getInputBody(input)).toMatchObject(expected);
  });
});

describe('Null body', () => {
  test('It should return undefined if the API Gateway V1 body is null', () => {
    const input = JSON.parse(JSON.stringify(apiGatewayV1));
    input.body = null;
    expect(getInputBody(input)).toBeNull();
  });

  test('It should return an empty object if the API Gateway V1 body is an empty object', () => {
    const input = JSON.parse(JSON.stringify(apiGatewayV1));
    input.body = {};
    expect(getInputBody(input)).toMatchObject({});
  });

  test('It should return undefined if the API Gateway V2 body is null', () => {
    const input = JSON.parse(JSON.stringify(apiGatewayV2));
    input.body = null;
    expect(getInputBody(input)).toBeNull();
  });

  test('It should return an empty object if the API Gateway V2 body is an empty object', () => {
    const input = JSON.parse(JSON.stringify(apiGatewayV2));
    input.body = {};
    expect(getInputBody(input)).toMatchObject({});
  });

  test('It should return undefined if the EventBridge body is null', () => {
    const input = JSON.parse(JSON.stringify(eventBridgeEvent));
    input.detail = null;
    expect(getInputBody(input)).toBeUndefined();
  });

  test('It should return an empty object if the EventBridge body is an empty object', () => {
    const input = JSON.parse(JSON.stringify(eventBridgeEvent));
    input.detail = {};
    expect(getInputBody(input)).toMatchObject({});
  });
});
