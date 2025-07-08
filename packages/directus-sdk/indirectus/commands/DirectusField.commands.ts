import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Create a single directus fields item.
 */
export function createDirectusFieldItem<
  const Query extends DirectusSDK.Query<Schema, Directus.DirectusField<Schema>>,
>(
  collection: keyof Schema,
  item: Partial<Collections.DirectusField>,
  query?: Query,
): ReturnType<typeof DirectusSDK.createField<Schema, Query>> {
  return DirectusSDK.createField<Schema, Query>(collection, item, query);
}

/**
 * Read munknown directus fields items.
 */
export function readDirectusFieldItems(): ReturnType<
  typeof DirectusSDK.readFields<Schema>
> {
  return DirectusSDK.readFields<Schema>();
}

/**
 * Read munknown directus fields items.
 */
export const listDirectusField = readDirectusFieldItems;

/**
 * Gets a single known directus fields item by id.
 */
export function readDirectusFieldItem(
  collection: keyof Schema,
  field: Directus.DirectusField<Schema>["field"],
): ReturnType<typeof DirectusSDK.readField<Schema>> {
  return DirectusSDK.readField<Schema>(collection, field);
}

/**
 * Gets a single known directus fields item by id.
 */
export const readDirectusField = readDirectusFieldItem;

/**
 * Gets a single known directus fields item by id.
 */
export function updateDirectusFieldItem<
  const Query extends Directus.Query<Schema, Directus.DirectusField<Schema>>,
>(
  key: Collections.DirectusField extends { collection: number | string }
    ? Collections.DirectusField["collection"]
    : string | number,
  field: Directus.DirectusField<Schema>["field"],
  patch: Partial<Collections.DirectusField>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateField<Schema, Query>> {
  return DirectusSDK.updateField<Schema, Query>(key, field, patch, query);
}

/**
 * Deletes a single known directus fields item by id.
 */
export function deleteDirectusFieldItem(
  collection: Directus.DirectusField<Schema>["collection"],
  field: Directus.DirectusField<Schema>["field"],
): ReturnType<typeof DirectusSDK.deleteField<Schema>> {
  return DirectusSDK.deleteField<Schema>(collection, field);
}

/**
 * Aggregates directus fields items.
 */
export function aggregateDirectusFieldItems<
  Options extends Directus.AggregationOptions<Schema, "directus_fields">,
>(
  option: Options,
): ReturnType<
  typeof DirectusSDK.aggregate<Schema, "directus_fields", Options>
> {
  return DirectusSDK.aggregate<Schema, "directus_fields", Options>(
    "directus_fields",
    option,
  );
}
