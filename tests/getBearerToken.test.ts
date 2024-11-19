import { describe, expect, test } from 'vitest';

import { getBearerToken } from '../src/functions/getBearerToken.js';

describe('Null responses', () => {
  test('It should return null for non-authorization headers', () => {
    expect(getBearerToken({})).toBeNull();
  });

  test('It should return null for a valid authorization key that does not include "Bearer"', () => {
    expect(
      getBearerToken({
        Authorization: 'abc123',
      }),
    ).toBeNull();
  });
});

describe('Token responses', () => {
  test('It should return the token value for a lower-case "authorization" header', () => {
    const expected = 'abc123';
    expect(
      getBearerToken({
        authorization: `Bearer ${expected}`,
      }),
    ).toBe(expected);
  });

  test('It should return the token value for a title-case "Authorization" header', () => {
    const expected = 'abc123';
    expect(
      getBearerToken({
        Authorization: `Bearer ${expected}`,
      }),
    ).toBe(expected);
  });
});
