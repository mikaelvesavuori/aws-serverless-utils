/**
 * @description Get the contents of an EventBridge `metadata` object, as per the
 * data + metadata convention.
 * @see https://www.boyney.io/blog/2022-02-11-event-payload-patterns
 */
export function getMetadata(event: Record<string, any>) {
  return event?.detail?.metadata;
}
