/**
 * @description Get query string parameters if they exist, else an empty object..
 */
export function getQueryStringParameters(
  event: Record<string, any>,
): Record<string, string> {
  return event?.queryStringParameters || {};
}
