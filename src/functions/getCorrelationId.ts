/**
 * @description Get correlation ID from:
 * 1) Environment, via `CORRELATION_ID`
 * 2) Event headers (`event.headers.['x-correlation-id']` or `event.headers.['X-Correlation-Id']`)
 * 3) Event metadata (`event.detail.metadata.correlationId` or `event.detail.metadata.correlation_id`)
 * 4) Context request ID (`awsRequestId`)
 * 5) Empty string, if nothing is found
 * @param event AWS event object
 * @param context AWS context object
 * @returns string
 */
export function getCorrelationId(
  event?: Record<string, any>,
  context?: Record<string, any>,
): string {
  return (
    process.env.CORRELATION_ID ||
    event?.headers?.['x-correlation-id'] ||
    event?.headers?.['X-Correlation-Id'] ||
    event?.detail?.metadata?.correlationId ||
    event?.detail?.metadata?.correlation_id ||
    context?.awsRequestId ||
    ''
  );
}
