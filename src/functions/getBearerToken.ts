/**
 * @description Extract the Bearer token from the Authorization header.
 *
 * The value must start with "Bearer".
 *
 * @example
 * const token = getBearerToken({ Authorization: 'Bearer some-very-long-value-123-abc...' }); // Result: 'some-very-long-value-123-abc...'
 */
export function getBearerToken(headers: Record<string, string>): string | null {
  const authorization = headers.Authorization || headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) return null;

  return authorization.replace('Bearer ', '');
}
