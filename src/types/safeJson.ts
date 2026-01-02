/**
 * Type-safe JSON types for structured data logging and API responses
 * Replaces unsafe `any` types throughout the codebase
 */

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export interface JsonObject {
  [k: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}

/**
 * Converts unknown data to a JSON-safe value
 */
export function toJsonValue(value: unknown): JsonValue {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(toJsonValue);
  }
  if (typeof value === 'object') {
    const result: JsonObject = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = toJsonValue(v);
    }
    return result;
  }
  return String(value);
}
