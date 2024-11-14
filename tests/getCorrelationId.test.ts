import { describe, expect, test } from 'vitest';

import { getCorrelationId } from '../src/functions/getCorrelationId.js';

const expected = 'abc123';

describe('Correlation ID from environment', () => {
  test('From environment', () => {
    process.env.CORRELATION_ID = expected;
    const result = getCorrelationId();
    expect(result).toBe(expected);
    process.env.CORRELATION_ID = '';
  });
});

describe('Correlation ID from headers', () => {
  test('From lower-case headers', () => {
    const result = getCorrelationId({
      headers: { 'x-correlation-id': expected },
    });
    expect(result).toBe(expected);
  });

  test('From title-case headers', () => {
    const result = getCorrelationId({
      headers: { 'X-Correlation-Id': expected },
    });
    expect(result).toBe(expected);
  });
});

describe('Correlation ID from event metadata', () => {
  test('From correlationId', () => {
    const result = getCorrelationId({
      detail: { metadata: { correlationId: expected } },
    });
    expect(result).toBe(expected);
  });

  test('From correlation_id', () => {
    const result = getCorrelationId({
      detail: { metadata: { correlation_id: expected } },
    });
    expect(result).toBe(expected);
  });
});

describe('Correlation ID from context', () => {
  test('From AWS request ID', () => {
    const result = getCorrelationId({}, { awsRequestId: expected });
    expect(result).toBe(expected);
  });
});

describe('No correlation ID', () => {
  test('Return empty string if no match', () => {
    const result = getCorrelationId({}, {});
    expect(result).toBe('');
  });
});
