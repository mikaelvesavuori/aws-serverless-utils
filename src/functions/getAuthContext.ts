/**
 * @description Get the authorization data coming from the Lambda authorizer.
 */
export function getAuthContext(event: Record<string, any>) {
  return event?.requestContext?.authorizer?.lambda || {};
}
