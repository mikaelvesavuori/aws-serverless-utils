import { MikroLog } from 'mikrolog';
import { expect, test } from 'vitest';

import { startLogger } from '../src/functions/startLogger.js';

const expected = 'abc123';

test('It should return an instance of MikroLog', () => {
  const result = startLogger({}, {}, {});
  expect(result).toBeInstanceOf(MikroLog);
});

test('It should set the correlation ID', () => {
  process.env.CORRELATION_ID = expected;
  const logger = startLogger({}, {}, {});
  const result = logger.log('test').correlationId;
  expect(result).toBe(expected);
  process.env.CORRELATION_ID = '';
});
