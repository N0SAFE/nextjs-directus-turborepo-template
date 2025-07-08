import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Create many directus operations items.
 */
export function createDirectusOperationItems<
  const Query extends Directus.Query<Schema, Collections.DirectusOperation>,
>(
  items: Partial<Collections.DirectusOperation>[],
  query?: Query,
): ReturnType<typeof DirectusSDK.createOperations<Schema, Query>> {
  return DirectusSDK.createOperations<Schema, Query>(items, query);
}

/**
 * Create a single directus operations item.
 */
export function createDirectusOperationItem<
  const Query extends DirectusSDK.Query<
    Schema,
    Directus.DirectusOperation<Schema>
  >, // Is this a mistake? Why []?
>(
  item: Partial<Collections.DirectusOperation>,
  query?: Query,
): ReturnType<typeof DirectusSDK.createOperation<Schema, Query>> {
  return DirectusSDK.createOperation<Schema, Query>(item, query);
}

/**
 * Read many directus operations items.
 */
export function readDirectusOperationItems<
  const Query extends Directus.Query<Schema, Collections.DirectusOperation>,
>(query?: Query): ReturnType<typeof DirectusSDK.readOperations<Schema, Query>> {
  return DirectusSDK.readOperations<Schema, Query>(query);
}

/**
 * Read many directus operations items.
 */
export const listDirectusOperation = readDirectusOperationItems;

/**
 * Gets a single known directus operations item by id.
 */
export function readDirectusOperationItem<
  const Query extends Directus.Query<Schema, Collections.DirectusOperation>,
>(
  key: Collections.DirectusOperation extends { id: number | string }
    ? Collections.DirectusOperation["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readOperation<Schema, Query>> {
  return DirectusSDK.readOperation<Schema, Query>(key, query);
}

/**
 * Gets a single known directus operations item by id.
 */
export const readDirectusOperation = readDirectusOperationItem;

/**
 * Read many directus operations items.
 */
export function updateDirectusOperationItems<
  const Query extends Directus.Query<Schema, Collections.DirectusOperation>,
>(
  keys: Collections.DirectusOperation extends { id: number | string }
    ? Collections.DirectusOperation["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusOperation>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateOperations<Schema, Query>> {
  return DirectusSDK.updateOperations<Schema, Query>(keys, patch, query);
}

/**
 * Gets a single known directus operations item by id.
 */
export function updateDirectusOperationItem<
  const Query extends Directus.Query<Schema, Collections.DirectusOperation>,
>(
  key: Collections.DirectusOperation extends { id: number | string }
    ? Collections.DirectusOperation["id"]
    : string | number,
  patch: Partial<Collections.DirectusOperation>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateOperation<Schema, Query>> {
  return DirectusSDK.updateOperation<Schema, Query>(key, patch, query);
}

/**
 * Deletes many directus operations items.
 */
export function deleteDirectusOperationItems(
  keys: Collections.DirectusOperation extends { id: number | string }
    ? Collections.DirectusOperation["id"][]
    : string[] | number[],
): ReturnType<typeof DirectusSDK.deleteOperations<Schema>> {
  return DirectusSDK.deleteOperations<Schema>(keys);
}

/**
 * Deletes a single known directus operations item by id.
 */
export function deleteDirectusOperationItem(
  key: Collections.DirectusOperation extends { id: number | string }
    ? Collections.DirectusOperation["id"]
    : string | number,
): ReturnType<typeof DirectusSDK.deleteOperation<Schema>> {
  return DirectusSDK.deleteOperation<Schema>(key);
}

/**
 * Aggregates directus operations items.
 */
export function aggregateDirectusOperationItems<
  Options extends Directus.AggregationOptions<Schema, "directus_operations">,
>(
  option: Options,
): ReturnType<
  typeof DirectusSDK.aggregate<Schema, "directus_operations", Options>
> {
  return DirectusSDK.aggregate<Schema, "directus_operations", Options>(
    "directus_operations",
    option,
  );
}
