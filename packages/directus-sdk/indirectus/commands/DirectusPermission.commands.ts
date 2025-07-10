import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Create many directus permissions items.
 */
export function createDirectusPermissionItems<
  const Query extends Directus.Query<Schema, Collections.DirectusPermission>,
>(
  items: Partial<Collections.DirectusPermission>[],
  query?: Query,
): ReturnType<typeof DirectusSDK.createPermissions<Schema, Query>> {
  return DirectusSDK.createPermissions<Schema, Query>(items, query);
}

/**
 * Create a single directus permissions item.
 */
export function createDirectusPermissionItem<
  const Query extends DirectusSDK.Query<
    Schema,
    Directus.DirectusPermission<Schema>
  >, // Is this a mistake? Why []?
>(
  item: Partial<Collections.DirectusPermission>,
  query?: Query,
): ReturnType<typeof DirectusSDK.createPermission<Schema, Query>> {
  return DirectusSDK.createPermission<Schema, Query>(item, query);
}

/**
 * Read many directus permissions items.
 */
export function readDirectusPermissionItems<
  const Query extends Directus.Query<Schema, Collections.DirectusPermission>,
>(
  query?: Query,
): ReturnType<typeof DirectusSDK.readPermissions<Schema, Query>> {
  return DirectusSDK.readPermissions<Schema, Query>(query);
}

/**
 * Read many directus permissions items.
 */
export const listDirectusPermission = readDirectusPermissionItems;

/**
 * Gets a single known directus permissions item by id.
 */
export function readDirectusPermissionItem<
  const Query extends Directus.Query<Schema, Collections.DirectusPermission>,
>(
  key: Collections.DirectusPermission extends { id: number | string }
    ? Collections.DirectusPermission["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readPermission<Schema, Query>> {
  return DirectusSDK.readPermission<Schema, Query>(key, query);
}

/**
 * Gets a single known directus permissions item by id.
 */
export const readDirectusPermission = readDirectusPermissionItem;

/**
 * Read many directus permissions items.
 */
export function updateDirectusPermissionItems<
  const Query extends Directus.Query<
    Schema,
    Directus.DirectusPermission<Schema>
  >,
>(
  keys: Collections.DirectusPermission extends { id: number | string }
    ? Collections.DirectusPermission["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusPermission>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updatePermissions<Schema, Query>> {
  return DirectusSDK.updatePermissions<Schema, Query>(keys, patch, query);
}

/**
 * Gets a single known directus permissions item by id.
 */
export function updateDirectusPermissionItem<
  const Query extends Directus.Query<Schema, Collections.DirectusPermission>,
>(
  key: Collections.DirectusPermission extends { id: number | string }
    ? Collections.DirectusPermission["id"]
    : string | number,
  patch: Partial<Collections.DirectusPermission>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updatePermission<Schema, Query>> {
  return DirectusSDK.updatePermission<Schema, Query>(key, patch, query);
}

/**
 * Deletes many directus permissions items.
 */
export function deleteDirectusPermissionItems(
  keys: Collections.DirectusPermission extends { id: number | string }
    ? Collections.DirectusPermission["id"][]
    : string[] | number[],
): ReturnType<typeof DirectusSDK.deletePermissions<Schema>> {
  return DirectusSDK.deletePermissions<Schema>(keys);
}

/**
 * Deletes a single known directus permissions item by id.
 */
export function deleteDirectusPermissionItem(
  key: Collections.DirectusPermission extends { id: number | string }
    ? Collections.DirectusPermission["id"]
    : string | number,
): ReturnType<typeof DirectusSDK.deletePermission<Schema>> {
  return DirectusSDK.deletePermission<Schema>(key);
}

/**
 * Aggregates directus permissions items.
 */
export function aggregateDirectusPermissionItems<
  Options extends Directus.AggregationOptions<Schema, "directus_permissions">,
>(
  option: Options,
): ReturnType<
  typeof DirectusSDK.aggregate<Schema, "directus_permissions", Options>
> {
  return DirectusSDK.aggregate<Schema, "directus_permissions", Options>(
    "directus_permissions",
    option,
  );
}
