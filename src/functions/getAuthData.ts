/**
 * @description Get the authorization data coming from the Lambda authorizer.
 */
export function getAuthData(event: any) {
  return event?.requestContext?.authorizer?.lambda || {};
}
