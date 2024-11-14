/**
 * @description Clean up and return DynamoDB items in a normalized format.
 * Accepts one or multiple items and returns an array of cleaned objects.
 * Returns a cleaned and parsed array of objects.
 */
export function getCleanedDynamoItems(
  items: DynamoItem | DynamoItem[],
  includePkSk = false,
): Record<string, any>[] {
  if (!items) return [];

  const normalizedItems = Array.isArray(items) ? items : [items];
  return normalizedItems.map((item: DynamoItem) =>
    cleanDynamoData(item, includePkSk),
  );
}

/**
 * @description Cleans a single DynamoDB item, converting DynamoDB types to JavaScript equivalents.
 * Also parses any JSON strings back into objects where necessary.
 * Returns a cleaned and parsed object.
 *
 * You will want to use `getCleanedDynamoItems()` instead of this.
 */
export function cleanDynamoData(
  data: Record<string, any>,
  includePkSk = false,
): Record<string, any> {
  const cleanData: Record<string, any> = {};

  for (const key in data) {
    if (includePkSk || (key !== 'pk' && key !== 'sk'))
      cleanData[key] = extractDynamoValue(data[key]);
  }

  // Parse JSON strings if they resemble JSON objects/arrays
  for (const key in cleanData) {
    if (
      typeof cleanData[key] === 'string' &&
      (cleanData[key].startsWith('{') || cleanData[key].startsWith('['))
    ) {
      try {
        cleanData[key] = JSON.parse(cleanData[key]);
      } catch {
        // If JSON parsing fails, keep the value as a string
      }
    }
  }

  return cleanData;
}

/**
 * @description Recursively extracts DynamoDB attribute values to JavaScript equivalents.
 * Returns the JavaScript equivalent of the DynamoDB attribute.
 *
 * You will want to use `getCleanedDynamoItems()` instead of this.
 */
export function extractDynamoValue(value: any): any {
  if (!value) return null;

  if (value.S) return value.S;
  if (value.N) return Number(value.N);
  if (value.B) return value.B;
  if (value.SS) return value.SS;
  if (value.NS) return value.NS.map((n: string) => Number(n));
  if (value.BS) return value.BS;
  if (value.L) return value.L.map((item: any) => extractDynamoValue(item));
  if (value.M) {
    return Object.entries(value.M).reduce(
      (acc: Record<string, any>, [k, v]) => {
        acc[k] = extractDynamoValue(v);
        return acc;
      },
      {},
    );
  }
  if (value.NULL) return null;
  if (value.BOOL) return value.BOOL;

  return null;
}

/**
 * @description Record in the database.
 */
type DynamoItem = {
  [key: string]: StringRepresentation;
};

/**
 * @description String that represents the value.
 */
type StringRepresentation = {
  S: string;
};
