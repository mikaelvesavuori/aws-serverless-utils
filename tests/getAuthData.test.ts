import { test, describe, expect } from 'vitest';

import { getAuthData } from '../src/functions/getAuthData.js';

import apiGatewayV2 from '../testdata/ApiGatewayV2.json';

describe('Authenticated context', () => {
  const expected = {
    organizationId: 'abc123',
    recordId: 'qwerty'
  };

  test('It should retrieve the authenticated context from an API Gateway V2 (HTTP API) object', () => {
    expect(getAuthData(apiGatewayV2)).toMatchObject(expected);
  });

  test('It should return an empty object if there is no Lambda Authorizer request context', () => {
    const input = JSON.parse(JSON.stringify(apiGatewayV2));
    input.requestContext.authorizer = null;
    expect(getAuthData(input)).toMatchObject({});
  });
});
