import { MikroLog } from 'mikrolog';

/**
 * @description Utility function to create a valid AWS Lambda response object.
 * Note that headers will be completely replaced if you supply custom headers.
 * @example
 * end(); // Returns a 201 with no message and CORS headers
 * end(204); // Returns a 204 with no message and CORS headers
 * end(200, { timeCreated: '2024-10-27', itemId: 'abc123' }); // Returns a 200 with an object message
 * end(200, null, { 'X-Custom-Header': 'custom-value' }); // Replaces the headers with a custom set of headers
 */
export function end(
  statusCode = 201,
  message?: Record<string, any> | number | string | boolean | null,
  headers?: Record<string, any>,
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

  process.env.CORRELATION_ID = '';
  MikroLog.reset();

  return {
    statusCode,
    body,
    headers,
  };
}
