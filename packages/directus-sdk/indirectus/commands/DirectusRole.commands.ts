import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Create many directus roles items.
 */
export function createDirectusRoleItems<
  const Query extends Directus.Query<Schema, Collections.DirectusRole>,
>(
  items: Partial<Collections.DirectusRole>[],
  query?: Query,
): ReturnType<typeof DirectusSDK.createRoles<Schema, Query>> {
  return DirectusSDK.createRoles<Schema, Query>(items, query);
}

/**
 * Create a single directus roles item.
 */
export function createDirectusRoleItem<
  const Query extends DirectusSDK.Query<Schema, Directus.DirectusRole<Schema>>, // Is this a mistake? Why []?
>(
  item: Partial<Collections.DirectusRole>,
  query?: Query,
): ReturnType<typeof DirectusSDK.createRole<Schema, Query>> {
  return DirectusSDK.createRole<Schema, Query>(item, query);
}

/**
 * Read many directus roles items.
 */
export function readDirectusRoleItems<
  const Query extends Directus.Query<Schema, Collections.DirectusRole>,
>(query?: Query): ReturnType<typeof DirectusSDK.readRoles<Schema, Query>> {
  return DirectusSDK.readRoles<Schema, Query>(query);
}

/**
 * Read many directus roles items.
 */
export const listDirectusRole = readDirectusRoleItems;

/**
 * Gets a single known directus roles item by id.
 */
export function readDirectusRoleItem<
  const Query extends Directus.Query<Schema, Collections.DirectusRole>,
>(
  key: Collections.DirectusRole extends { id: number | string }
    ? Collections.DirectusRole["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readRole<Schema, Query>> {
  return DirectusSDK.readRole<Schema, Query>(key, query);
}

/**
 * Gets a single known directus roles item by id.
 */
export const readDirectusRole = readDirectusRoleItem;

/**
 * Read many directus roles items.
 */
export function updateDirectusRoleItems<
  const Query extends Directus.Query<Schema, Collections.DirectusRole>,
>(
  keys: Collections.DirectusRole extends { id: number | string }
    ? Collections.DirectusRole["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusRole>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateRoles<Schema, Query>> {
  return DirectusSDK.updateRoles<Schema, Query>(keys, patch, query);
}

/**
 * Gets a single known directus roles item by id.
 */
export function updateDirectusRoleItem<
  const Query extends Directus.Query<Schema, Collections.DirectusRole>,
>(
  key: Collections.DirectusRole extends { id: number | string }
    ? Collections.DirectusRole["id"]
    : string | number,
  patch: Partial<Collections.DirectusRole>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateRole<Schema, Query>> {
  return DirectusSDK.updateRole<Schema, Query>(key, patch, query);
}

/**
 * Deletes many directus roles items.
 */
export function deleteDirectusRoleItems(
  keys: Collections.DirectusRole extends { id: number | string }
    ? Collections.DirectusRole["id"][]
    : string[] | number[],
): ReturnType<typeof DirectusSDK.deleteRoles<Schema>> {
  return DirectusSDK.deleteRoles<Schema>(keys);
}

/**
 * Deletes a single known directus roles item by id.
 */
export function deleteDirectusRoleItem(
  key: Collections.DirectusRole extends { id: number | string }
    ? Collections.DirectusRole["id"]
    : string | number,
): ReturnType<typeof DirectusSDK.deleteRole<Schema>> {
  return DirectusSDK.deleteRole<Schema>(key);
}

/**
 * Aggregates directus roles items.
 */
export function aggregateDirectusRoleItems<
  Options extends Directus.AggregationOptions<Schema, "directus_roles">,
>(
  option: Options,
): ReturnType<typeof DirectusSDK.aggregate<Schema, "directus_roles", Options>> {
  return DirectusSDK.aggregate<Schema, "directus_roles", Options>(
    "directus_roles",
    option,
  );
}
