/**
 * @description Map out values as DynamoDB attributes.
 * Use this to convert JSON to a shape ready to use with DynamoDB.
 *
 * Supports mapping to:
 *- `NULL`
 *- `BOOL`
 *- `S`
 *- `N`
 *- `L`
 *- `M`
 */
export function mapToDynamoAttribute(value: any): any {
  if (value === null) return { NULL: true }; // Explicitly handle null values
  if (typeof value === 'boolean') return { BOOL: value };
  else if (typeof value === 'string') return { S: value };
  else if (typeof value === 'number') return { N: value.toString() };
  else if (Array.isArray(value))
    return { L: value.map(mapToDynamoAttribute) }; // Recursively handle arrays
  else if (typeof value === 'object') {
    return {
      M: Object.entries(value).reduce(
        (acc, [key, val]) => {
          acc[key] = mapToDynamoAttribute(val); // Recursively handle objects
          return acc;
        },
        {} as { [key: string]: any }
      )
    };
  }

  return { NULL: true }; // Fallback for undefined or other types if necessary
}
