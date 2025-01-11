import { MikroLog } from 'mikrolog';

import { getCorrelationId } from './getCorrelationId.js';

/**
 * @description Starts an instance of MikroLog with correlation ID already set up and returns it.
 * It will also set the `CORRELATION_ID` environment variable to the correlation ID
 * from the event or context, or if none is found, it will use the `awsRequestId` from the context.
 * @param event AWS event object
 * @param context AWS context object
 * @param metadataConfig MikroLog metadata configuration object
 * @see https://github.com/mikaelvesavuori/mikrolog?tab=readme-ov-file#configuration
 * @returns MikroLog instance
 */
export function startLogger(
  event: Record<string, any>,
  context: Record<string, any>,
  metadataConfig: Record<string, any>,
) {
  const correlationId = getCorrelationId(event, context);
  process.env.CORRELATION_ID = correlationId;

  const logger = MikroLog.start({
    metadataConfig,
    event,
    context,
  });

  MikroLog.logBuffer = []; // Safety valve

  return logger;
}
