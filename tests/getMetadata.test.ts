import { describe, expect, test } from 'vitest';

import { getMetadata } from '../src/functions/getMetadata.js';

describe('Get metadata from EventBridge event', () => {
  test('It should return undefined if no event is provided', () => {
    // @ts-ignore
    expect(getMetadata()).toBeUndefined();
  });

  test('It should return undefined if an input object does not contain the detail object', () => {
    expect(getMetadata({})).toBeUndefined();
  });

  test('It should return undefined if an input object does not contain the detail.metadata object', () => {
    expect(getMetadata({ detail: { a: 123 } })).toBeUndefined();
  });

  test('It should return the metadata contents', () => {
    const expected = { abc123: true };
    expect(getMetadata({ detail: { metadata: expected } })).toMatchObject(
      expected,
    );
  });
});
