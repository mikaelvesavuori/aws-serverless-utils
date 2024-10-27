import { test, describe, expect } from 'vitest';

import { getPathParameters } from '../src/functions/getPathParameters.js';

import apiGatewayV1 from '../testdata/ApiGatewayV1.json';
import apiGatewayV2 from '../testdata/ApiGatewayV2.json';

describe('Path parameters', () => {
  const expected = {
    organizationId: 'abc123',
    recordId: 'qwerty'
  };

  test('It should get the path parameters from an API Gateway V1 (REST API) object', () => {
    expect(getPathParameters(apiGatewayV1)).toMatchObject(expected);
  });

  test('It should get the path parameters from an API Gateway V2 (HTTP API) object', () => {
    expect(getPathParameters(apiGatewayV2)).toMatchObject(expected);
  });

  test('It should get an empty object if there are no path parameters', () => {
    const input = JSON.parse(JSON.stringify(apiGatewayV2));
    input.pathParameters = null;
    expect(getPathParameters(input)).toMatchObject({});
  });
});
