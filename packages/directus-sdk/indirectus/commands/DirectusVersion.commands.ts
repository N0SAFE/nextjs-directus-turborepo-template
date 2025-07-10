import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Create many directus versions items.
 */
export function createDirectusVersionItems<
  const Query extends Directus.Query<Schema, Collections.DirectusVersion>,
>(
  items: Partial<Collections.DirectusVersion>[],
  query?: Query,
): ReturnType<typeof DirectusSDK.createContentVersions<Schema, Query>> {
  return DirectusSDK.createContentVersions<Schema, Query>(items, query);
}

/**
 * Create a single directus versions item.
 */
export function createDirectusVersionItem<
  const Query extends DirectusSDK.Query<Schema, Collections.DirectusVersion>, // Is this a mistake? Why []?
>(
  item: Partial<Collections.DirectusVersion>,
  query?: Query,
): ReturnType<typeof DirectusSDK.createContentVersion<Schema, Query>> {
  return DirectusSDK.createContentVersion<Schema, Query>(item, query);
}

/**
 * Read many directus versions items.
 */
export function readDirectusVersionItems<
  const Query extends Directus.Query<Schema, Collections.DirectusVersion>,
>(
  query?: Query,
): ReturnType<typeof DirectusSDK.readContentVersions<Schema, Query>> {
  return DirectusSDK.readContentVersions<Schema, Query>(query);
}

/**
 * Read many directus versions items.
 */
export const listDirectusVersion = readDirectusVersionItems;

/**
 * Gets a single known directus versions item by id.
 */
export function readDirectusVersionItem<
  const Query extends Directus.Query<Schema, Collections.DirectusVersion>,
>(
  key: Collections.DirectusVersion extends { id: number | string }
    ? Collections.DirectusVersion["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readContentVersion<Schema, Query>> {
  return DirectusSDK.readContentVersion<Schema, Query>(key, query);
}

/**
 * Gets a single known directus versions item by id.
 */
export const readDirectusVersion = readDirectusVersionItem;

/**
 * Read many directus versions items.
 */
export function updateDirectusVersionItems<
  const Query extends Directus.Query<Schema, Directus.DirectusVersion<Schema>>,
>(
  keys: Collections.DirectusVersion extends { id: number | string }
    ? Collections.DirectusVersion["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusVersion>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateContentVersions<Schema, Query>> {
  return DirectusSDK.updateContentVersions<Schema, Query>(keys, patch, query);
}

/**
 * Gets a single known directus versions item by id.
 */
export function updateDirectusVersionItem<
  const Query extends Directus.Query<Schema, Collections.DirectusVersion>,
>(
  key: Collections.DirectusVersion extends { id: number | string }
    ? Collections.DirectusVersion["id"]
    : string | number,
  patch: Partial<Collections.DirectusVersion>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateContentVersion<Schema, Query>> {
  return DirectusSDK.updateContentVersion<Schema, Query>(key, patch, query);
}

/**
 * Deletes many directus versions items.
 */
export function deleteDirectusVersionItems(
  keys: Collections.DirectusVersion extends { id: number | string }
    ? Collections.DirectusVersion["id"][]
    : string[] | number[],
): ReturnType<typeof DirectusSDK.deleteContentVersions<Schema>> {
  return DirectusSDK.deleteContentVersions<Schema>(keys);
}

/**
 * Deletes a single known directus versions item by id.
 */
export function deleteDirectusVersionItem(
  key: Collections.DirectusVersion extends { id: number | string }
    ? Collections.DirectusVersion["id"]
    : string | number,
): ReturnType<typeof DirectusSDK.deleteContentVersion<Schema>> {
  return DirectusSDK.deleteContentVersion<Schema>(key);
}

/**
 * Aggregates directus versions items.
 */
export function aggregateDirectusVersionItems<
  Options extends Directus.AggregationOptions<Schema, "directus_versions">,
>(
  option: Options,
): ReturnType<
  typeof DirectusSDK.aggregate<Schema, "directus_versions", Options>
> {
  return DirectusSDK.aggregate<Schema, "directus_versions", Options>(
    "directus_versions",
    option,
  );
}
