import { describe, expect, test } from 'vitest';

import { getQueryStringParameters } from '../src/functions/getQueryStringParameters.js';

import apiGatewayV1 from '../testdata/ApiGatewayV1.json' with { type: 'json' };
import apiGatewayV2 from '../testdata/ApiGatewayV2.json' with { type: 'json' };

describe('Query string parameters', () => {
  const expected = {
    organizationId: 'abc123',
    recordId: 'qwerty',
  };

  test('It should get the path parameters from an API Gateway V1 (REST API) object', () => {
    expect(getQueryStringParameters(apiGatewayV1)).toMatchObject(expected);
  });

  test('It should get the path parameters from an API Gateway V2 (HTTP API) object', () => {
    expect(getQueryStringParameters(apiGatewayV2)).toMatchObject(expected);
  });

  test('It should get an empty object if there are no path parameters in a V1 object', () => {
    const input = JSON.parse(JSON.stringify(apiGatewayV1));
    input.queryStringParameters = null;
    expect(getQueryStringParameters(input)).toMatchObject({});
  });

  test('It should get an empty object if there are no path parameters in a V2 object', () => {
    const input = JSON.parse(JSON.stringify(apiGatewayV2));
    input.queryStringParameters = null;
    expect(getQueryStringParameters(input)).toMatchObject({});
  });
});
