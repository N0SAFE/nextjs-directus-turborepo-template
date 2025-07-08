import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * read current user.
 */
export function readMeItem<
  const Query extends Directus.Query<Schema, Collections.DirectusUser>,
>(query?: Query): ReturnType<typeof DirectusSDK.readMe<Schema, Query>> {
  return DirectusSDK.readMe<Schema, Query>(query);
}

export const readMe = readMeItem;

/**
 * read current user role.
 */
export function readMeRoleItem<
  const Query extends Directus.Query<Schema, Collections.DirectusRole>,
>(query?: Query): ReturnType<typeof DirectusSDK.readRolesMe<Schema, Query>> {
  return DirectusSDK.readRolesMe<Schema, Query>(query);
}

export const readMeRole = readMeRoleItem;

/**
 * update current user.
 */
export function updateMeItem<
  const Query extends Directus.Query<Schema, Collections.DirectusUser>,
>(
  patch: Partial<Collections.DirectusUser>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateMe<Schema, Query>> {
  return DirectusSDK.updateMe<Schema, Query>(patch, query);
}

/**
 * Create many directus users items.
 */
export function createDirectusUserItems<
  const Query extends Directus.Query<Schema, Collections.DirectusUser>,
>(
  items: Partial<Collections.DirectusUser>[],
  query?: Query,
): ReturnType<typeof DirectusSDK.createUsers<Schema, Query>> {
  return DirectusSDK.createUsers<Schema, Query>(items, query);
}

/**
 * Create a single directus users item.
 */
export function createDirectusUserItem<
  const Query extends DirectusSDK.Query<Schema, Directus.DirectusUser<Schema>>, // Is this a mistake? Why []?
>(
  item: Partial<Collections.DirectusUser>,
  query?: Query,
): ReturnType<typeof DirectusSDK.createUser<Schema, Query>> {
  return DirectusSDK.createUser<Schema, Query>(item, query);
}

/**
 * Read many directus users items.
 */
export function readDirectusUserItems<
  const Query extends Directus.Query<Schema, Collections.DirectusUser>,
>(query?: Query): ReturnType<typeof DirectusSDK.readUsers<Schema, Query>> {
  return DirectusSDK.readUsers<Schema, Query>(query);
}

/**
 * Read many directus users items.
 */
export const listDirectusUser = readDirectusUserItems;

/**
 * Gets a single known directus users item by id.
 */
export function readDirectusUserItem<
  const Query extends Directus.Query<Schema, Collections.DirectusUser>,
>(
  key: Collections.DirectusUser extends { id: number | string }
    ? Collections.DirectusUser["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readUser<Schema, Query>> {
  return DirectusSDK.readUser<Schema, Query>(key, query);
}

/**
 * Gets a single known directus users item by id.
 */
export const readDirectusUser = readDirectusUserItem;

/**
 * Read many directus users items.
 */
export function updateDirectusUserItems<
  const Query extends Directus.Query<Schema, Collections.DirectusUser>,
>(
  keys: Collections.DirectusUser extends { id: number | string }
    ? Collections.DirectusUser["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusUser>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateUsers<Schema, Query>> {
  return DirectusSDK.updateUsers<Schema, Query>(keys, patch, query);
}

/**
 * Gets a single known directus users item by id.
 */
export function updateDirectusUserItem<
  const Query extends Directus.Query<Schema, Collections.DirectusUser>,
>(
  key: Collections.DirectusUser extends { id: number | string }
    ? Collections.DirectusUser["id"]
    : string | number,
  patch: Partial<Collections.DirectusUser>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateUser<Schema, Query>> {
  return DirectusSDK.updateUser<Schema, Query>(key, patch, query);
}

/**
 * Deletes many directus users items.
 */
export function deleteDirectusUserItems(
  keys: Collections.DirectusUser extends { id: number | string }
    ? Collections.DirectusUser["id"][]
    : string[] | number[],
): ReturnType<typeof DirectusSDK.deleteUsers<Schema>> {
  return DirectusSDK.deleteUsers<Schema>(keys);
}

/**
 * Deletes a single known directus users item by id.
 */
export function deleteDirectusUserItem(
  key: Collections.DirectusUser extends { id: number | string }
    ? Collections.DirectusUser["id"]
    : string | number,
): ReturnType<typeof DirectusSDK.deleteUser<Schema>> {
  return DirectusSDK.deleteUser<Schema>(key);
}

/**
 * Aggregates directus users items.
 */
export function aggregateDirectusUserItems<
  Options extends Directus.AggregationOptions<Schema, "directus_users">,
>(
  option: Options,
): ReturnType<typeof DirectusSDK.aggregate<Schema, "directus_users", Options>> {
  return DirectusSDK.aggregate<Schema, "directus_users", Options>(
    "directus_users",
    option,
  );
}
