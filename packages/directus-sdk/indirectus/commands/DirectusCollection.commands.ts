import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Create a single directus collections item.
 */
export function createDirectusCollectionItem<
  const Query extends DirectusSDK.Query<Schema, Collections.DirectusCollection>, // Is this a mistake? Why []?
>(
  item: Partial<Collections.DirectusCollection>,
  query?: Query,
): ReturnType<typeof DirectusSDK.createCollection<Schema, Query>> {
  return DirectusSDK.createCollection<Schema, Query>(item, query);
}

/**
 * Read munknown directus collections items.
 */
export function readDirectusCollectionItems(): ReturnType<
  typeof DirectusSDK.readCollections<Schema>
> {
  return DirectusSDK.readCollections<Schema>();
}

/**
 * Read munknown directus collections items.
 */
export const listDirectusCollection = readDirectusCollectionItems;

/**
 * Gets a single known directus collections item by id.
 */
export function readDirectusCollectionItem(
  key: Collections.DirectusCollection extends { collection: number | string }
    ? Collections.DirectusCollection["collection"]
    : string | number,
): ReturnType<typeof DirectusSDK.readCollection<Schema>> {
  return DirectusSDK.readCollection<Schema>(key);
}

/**
 * Gets a single known directus collections item by id.
 */
export const readDirectusCollection = readDirectusCollectionItem;

/**
 * Gets a single known directus collections item by id.
 */
export function updateDirectusCollectionItem<
  const Query extends Directus.Query<
    Schema,
    Directus.DirectusCollection<Schema>
  >,
>(
  collection: keyof Schema,
  patch: Partial<Collections.DirectusCollection>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateCollection<Schema, Query>> {
  return DirectusSDK.updateCollection<Schema, Query>(collection, patch, query);
}

/**
 * updates munknown directus collections items.
 */
export function updateBatchDirectusCollectionItems<
  const Query extends Directus.Query<
    Schema,
    Directus.DirectusCollection<Schema>
  >,
>(
  items: Directus.NestedPartial<Collections.DirectusCollection>[],
  query?: Query,
): ReturnType<typeof DirectusSDK.updateCollectionsBatch<Schema, Query>> {
  return DirectusSDK.updateCollectionsBatch<Schema, Query>(items, query);
}

/**
 * Deletes a single known directus collections item by id.
 */
export function deleteDirectusCollectionItem(
  key: Collections.DirectusCollection extends { collection: number | string }
    ? Collections.DirectusCollection["collection"]
    : string | number,
): ReturnType<typeof DirectusSDK.deleteCollection<Schema>> {
  return DirectusSDK.deleteCollection<Schema>(key);
}

/**
 * Aggregates directus collections items.
 */
export function aggregateDirectusCollectionItems<
  Options extends Directus.AggregationOptions<Schema, "directus_collections">,
>(
  option: Options,
): ReturnType<
  typeof DirectusSDK.aggregate<Schema, "directus_collections", Options>
> {
  return DirectusSDK.aggregate<Schema, "directus_collections", Options>(
    "directus_collections",
    option,
  );
}
