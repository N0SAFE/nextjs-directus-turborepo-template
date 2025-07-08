import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Read munknown directus files items.
 */
export function readDirectusFileItems<
  const Query extends Directus.Query<Schema, Collections.DirectusFile>,
>(query?: Query): ReturnType<typeof DirectusSDK.readFiles<Schema, Query>> {
  return DirectusSDK.readFiles<Schema, Query>(query);
}

/**
 * Read munknown directus files items.
 */
export const listDirectusFile = readDirectusFileItems;

/**
 * Gets a single known directus files item by id.
 */
export function readDirectusFileItem<
  const Query extends Directus.Query<Schema, Collections.DirectusFile>,
>(
  key: Collections.DirectusFile extends { id: number | string }
    ? Collections.DirectusFile["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readFile<Schema, Query>> {
  return DirectusSDK.readFile<Schema, Query>(key, query);
}

/**
 * Gets a single known directus files item by id.
 */
export const readDirectusFile = readDirectusFileItem;

/**
 * read file as array buffer
 */
export function readDirectusFileArrayBuffer(
  key: Collections.DirectusFile extends { id: number | string }
    ? Collections.DirectusFile["id"]
    : string | number,
  query?: Directus.AssetsQuery,
): ReturnType<typeof DirectusSDK.readAssetArrayBuffer<Schema>> {
  return DirectusSDK.readAssetArrayBuffer<Schema>(key, query);
}

/**
 * read file as blob
 */
export function readDirectusFileBlob(
  key: Collections.DirectusFile extends { id: number | string }
    ? Collections.DirectusFile["id"]
    : string | number,
  query?: Directus.AssetsQuery,
): ReturnType<typeof DirectusSDK.readAssetBlob<Schema>> {
  return DirectusSDK.readAssetBlob<Schema>(key, query);
}

/**
 * read file as readable stream
 */
export function readDirectusFileStream(
  key: Collections.DirectusFile extends { id: number | string }
    ? Collections.DirectusFile["id"]
    : string | number,
  query?: Directus.AssetsQuery,
): ReturnType<typeof DirectusSDK.readAssetRaw<Schema>> {
  return DirectusSDK.readAssetRaw<Schema>(key, query);
}

/**
 * Read munknown directus files items.
 */
export function updateDirectusFileItems<
  const Query extends Directus.Query<Schema, Collections.DirectusFile>,
>(
  keys: Collections.DirectusFile extends { id: number | string }
    ? Collections.DirectusFile["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusFile>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateFiles<Schema, Query>> {
  return DirectusSDK.updateFiles<Schema, Query>(keys, patch, query);
}

export function updateBatchDirectusFileItems<
  const Query extends Directus.Query<Schema, Collections.DirectusFile>,
>(
  items: Directus.NestedPartial<Collections.DirectusFile>[],
  query?: Query,
): ReturnType<typeof DirectusSDK.updateFilesBatch<Schema, Query>> {
  return DirectusSDK.updateFilesBatch<Schema, Query>(items, query);
}

/**
 * Gets a single known directus files item by id.
 */
export function updateDirectusFileItem<
  const Query extends Directus.Query<Schema, Collections.DirectusFile>,
>(
  key: Collections.DirectusFile extends { id: number | string }
    ? Collections.DirectusFile["id"]
    : string | number,
  patch: Partial<Collections.DirectusFile>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateFile<Schema, Query>> {
  return DirectusSDK.updateFile<Schema, Query>(key, patch, query);
}

/**
 * Deletes munknown directus files items.
 */
export function deleteDirectusFileItems(
  keys: Collections.DirectusFile extends { id: number | string }
    ? Collections.DirectusFile["id"][]
    : string[] | number[],
): ReturnType<typeof DirectusSDK.deleteFiles<Schema>> {
  return DirectusSDK.deleteFiles<Schema>(keys);
}

/**
 * Deletes a single known directus files item by id.
 */
export function deleteDirectusFileItem(
  key: Collections.DirectusFile extends { id: number | string }
    ? Collections.DirectusFile["id"]
    : string | number,
): ReturnType<typeof DirectusSDK.deleteFile<Schema>> {
  return DirectusSDK.deleteFile<Schema>(key);
}

/**
 * Aggregates directus files items.
 */
export function aggregateDirectusFileItems<
  Options extends Directus.AggregationOptions<Schema, "directus_files">,
>(
  option: Options,
): ReturnType<typeof DirectusSDK.aggregate<Schema, "directus_files", Options>> {
  return DirectusSDK.aggregate<Schema, "directus_files", Options>(
    "directus_files",
    option,
  );
}
