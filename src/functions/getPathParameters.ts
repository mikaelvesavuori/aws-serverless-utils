/**
 * @description Get the `pathParameters` object if it exists, else an empty object.
 */
export function getPathParameters(event: Record<string, any>) {
  return event?.pathParameters || {};
}
