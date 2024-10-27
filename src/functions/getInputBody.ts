/**
 * @description Get the main input body from EventBridge or API Gateway input,
 * in which case it also handles if the input is stringified JSON.
 * If you follow the convention with `data` + `metadata` in EventBridge, then the `data`
 * object will be returned, otherwise the whole `detail` object will be returned.
 * It will also handle Base64-encoded bodies.
 */
export function getInputBody(event: Record<string, any>) {
  if (event?.detail) return event.detail?.data ? event.detail.data : event.detail; // EventBridge
  if (event.isBase64Encoded) return JSON.parse(Buffer.from(event.body, 'base64').toString('utf-8'));
  return event?.body && typeof event?.body === 'string' ? JSON.parse(event.body) : event.body; // API Gateway
}
