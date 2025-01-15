import { MikroLog } from 'mikrolog';

/**
 * @description Utility function to create a valid AWS Lambda response object.
 * Note that headers will be completely replaced if you supply custom headers.
 * @example
 * return await end(); // Returns a 200 with CORS headers but no message
 * return await end(204); // Returns a 204 with CORS headers but no message
 * return await end(200, { timeCreated: '2024-10-27', itemId: 'abc123' }); // Returns a 200 with an object message
 * return await end(200, null, { 'X-Custom-Header': 'custom-value' }); // Replaces the headers with a custom set of headers
 *
 * async function flushFn() {
 *   await sendLogsToService(MikroLog.logBuffer)
 * };
 *
 * return await end(200, null, null, flushFn); // Runs a "flush" function before ending
 */
export async function end(
  statusCode = 200,
  message?: Record<string, any> | number | string | boolean | null,
  headers?: Record<string, any>,
  flushFn?: Function,
) {
  const contentType =
    !message || typeof message === 'number' || typeof message === 'string'
      ? 'text/plain'
      : 'application/json';

  const body = (() => {
    if (typeof message === 'string') return message;
    return JSON.stringify(message);
  })();

  if (!headers)
    headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': contentType,
    };

  if (flushFn) await flushFn();

  process.env.CORRELATION_ID = '';
  MikroLog.reset();

  return {
    statusCode,
    body,
    headers,
  };
}
