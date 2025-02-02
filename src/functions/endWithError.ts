import { MikroLog } from 'mikrolog';

import { end } from './end.js';

/**
 * @description Utility function to create a valid AWS Lambda response object
 * when encountering an error.
 *
 * MikroLog will be initialized to log the error; because it's static, it will
 * reuse any previous configuration.
 *
 * The resulting status code will be the value of `error.cause.statusCode` or
 * it'll use the default value if not found (falling back to status `400`).
 *
 * Any provided headers will be passed to the `end()` function.
 * Please see the documentation for that function for more information.
 *
 * This supports the optional `flushFn` argument as the regular `end()` function does.
 */
export async function endWithError(options?: EndWithErrorOptions) {
  const error = options?.error;
  const defaultErrorCode = options?.defaultErrorCode || 400;
  const headers = options?.headers;
  const flushFn = options?.flushFn;

  const statusCode: number = error?.cause?.statusCode || defaultErrorCode;
  const errorName: string = error?.name ? `${error?.name}: ` : '';
  const errorMessage: string = error?.message || error || '';

  const message = errorName + errorMessage;

  const logger = MikroLog.start();
  logger.error(message, statusCode);

  return end({ statusCode, message, headers, flushFn });
}

export type EndWithErrorOptions = {
  error?: any;
  defaultErrorCode?: number;
  headers?: Record<string, any>;
  flushFn?: Function;
};
