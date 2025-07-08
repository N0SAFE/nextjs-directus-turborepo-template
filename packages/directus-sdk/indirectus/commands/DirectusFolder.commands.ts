import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Create many directus folders items.
 */
export function createDirectusFolderItems<
  const Query extends Directus.Query<Schema, Collections.DirectusFolder>,
>(
  items: Partial<Collections.DirectusFolder>[],
  query?: Query,
): ReturnType<typeof DirectusSDK.createFolders<Schema, Query>> {
  return DirectusSDK.createFolders<Schema, Query>(items, query);
}

/**
 * Create a single directus folders item.
 */
export function createDirectusFolderItem<
  const Query extends DirectusSDK.Query<
    Schema,
    Directus.DirectusFolder<Schema>
  >, // Is this a mistake? Why []?
>(
  item: Partial<Collections.DirectusFolder>,
  query?: Query,
): ReturnType<typeof DirectusSDK.createFolder<Schema, Query>> {
  return DirectusSDK.createFolder<Schema, Query>(item, query);
}

/**
 * Read many directus folders items.
 */
export function readDirectusFolderItems<
  const Query extends Directus.Query<Schema, Collections.DirectusFolder>,
>(query?: Query): ReturnType<typeof DirectusSDK.readFolders<Schema, Query>> {
  return DirectusSDK.readFolders<Schema, Query>(query);
}

/**
 * Read many directus folders items.
 */
export const listDirectusFolder = readDirectusFolderItems;

/**
 * Gets a single known directus folders item by id.
 */
export function readDirectusFolderItem<
  const Query extends Directus.Query<Schema, Collections.DirectusFolder>,
>(
  key: Collections.DirectusFolder extends { id: number | string }
    ? Collections.DirectusFolder["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readFolder<Schema, Query>> {
  return DirectusSDK.readFolder<Schema, Query>(key, query);
}

/**
 * Gets a single known directus folders item by id.
 */
export const readDirectusFolder = readDirectusFolderItem;

/**
 * Read many directus folders items.
 */
export function updateDirectusFolderItems<
  const Query extends Directus.Query<Schema, Directus.DirectusFolder<Schema>>,
>(
  keys: Collections.DirectusFolder extends { id: number | string }
    ? Collections.DirectusFolder["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusFolder>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateFolders<Schema, Query>> {
  return DirectusSDK.updateFolders<Schema, Query>(keys, patch, query);
}

/**
 * Gets a single known directus folders item by id.
 */
export function updateDirectusFolderItem<
  const Query extends Directus.Query<Schema, Collections.DirectusFolder>,
>(
  key: Collections.DirectusFolder extends { id: number | string }
    ? Collections.DirectusFolder["id"]
    : string | number,
  patch: Partial<Collections.DirectusFolder>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateFolder<Schema, Query>> {
  return DirectusSDK.updateFolder<Schema, Query>(key, patch, query);
}

/**
 * Deletes many directus folders items.
 */
export function deleteDirectusFolderItems(
  keys: Collections.DirectusFolder extends { id: number | string }
    ? Collections.DirectusFolder["id"][]
    : string[] | number[],
): ReturnType<typeof DirectusSDK.deleteFolders<Schema>> {
  return DirectusSDK.deleteFolders<Schema>(keys);
}

/**
 * Deletes a single known directus folders item by id.
 */
export function deleteDirectusFolderItem(
  key: Collections.DirectusFolder extends { id: number | string }
    ? Collections.DirectusFolder["id"]
    : string | number,
): ReturnType<typeof DirectusSDK.deleteFolder<Schema>> {
  return DirectusSDK.deleteFolder<Schema>(key);
}

/**
 * Aggregates directus folders items.
 */
export function aggregateDirectusFolderItems<
  Options extends Directus.AggregationOptions<Schema, "directus_folders">,
>(
  option: Options,
): ReturnType<
  typeof DirectusSDK.aggregate<Schema, "directus_folders", Options>
> {
  return DirectusSDK.aggregate<Schema, "directus_folders", Options>(
    "directus_folders",
    option,
  );
}
