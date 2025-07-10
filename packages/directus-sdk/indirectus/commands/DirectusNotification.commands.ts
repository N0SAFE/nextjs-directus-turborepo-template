import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Create many directus notifications items.
 */
export function createDirectusNotificationItems<
  const Query extends Directus.Query<Schema, Collections.DirectusNotification>,
>(
  items: Partial<Collections.DirectusNotification>[],
  query?: Query,
): ReturnType<typeof DirectusSDK.createNotifications<Schema, Query>> {
  return DirectusSDK.createNotifications<Schema, Query>(items, query);
}

/**
 * Create a single directus notifications item.
 */
export function createDirectusNotificationItem<
  const Query extends DirectusSDK.Query<
    Schema,
    Directus.DirectusNotification<Schema>
  >, // Is this a mistake? Why []?
>(
  item: Partial<Collections.DirectusNotification>,
  query?: Query,
): ReturnType<typeof DirectusSDK.createNotification<Schema, Query>> {
  return DirectusSDK.createNotification<Schema, Query>(item, query);
}

/**
 * Read many directus notifications items.
 */
export function readDirectusNotificationItems<
  const Query extends Directus.Query<Schema, Collections.DirectusNotification>,
>(
  query?: Query,
): ReturnType<typeof DirectusSDK.readNotifications<Schema, Query>> {
  return DirectusSDK.readNotifications<Schema, Query>(query);
}

/**
 * Read many directus notifications items.
 */
export const listDirectusNotification = readDirectusNotificationItems;

/**
 * Gets a single known directus notifications item by id.
 */
export function readDirectusNotificationItem<
  const Query extends Directus.Query<Schema, Collections.DirectusNotification>,
>(
  key: Collections.DirectusNotification extends { id: number | string }
    ? Collections.DirectusNotification["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readNotification<Schema, Query>> {
  return DirectusSDK.readNotification<Schema, Query>(key, query);
}

/**
 * Gets a single known directus notifications item by id.
 */
export const readDirectusNotification = readDirectusNotificationItem;

/**
 * Read many directus notifications items.
 */
export function updateDirectusNotificationItems<
  const Query extends Directus.Query<Schema, Collections.DirectusNotification>,
>(
  keys: Collections.DirectusNotification extends { id: number | string }
    ? Collections.DirectusNotification["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusNotification>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateNotifications<Schema, Query>> {
  return DirectusSDK.updateNotifications<Schema, Query>(keys, patch, query);
}

/**
 * Gets a single known directus notifications item by id.
 */
export function updateDirectusNotificationItem<
  const Query extends Directus.Query<Schema, Collections.DirectusNotification>,
>(
  key: Collections.DirectusNotification extends { id: number | string }
    ? Collections.DirectusNotification["id"]
    : string | number,
  patch: Partial<Collections.DirectusNotification>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateNotification<Schema, Query>> {
  return DirectusSDK.updateNotification<Schema, Query>(key, patch, query);
}

/**
 * Deletes many directus notifications items.
 */
export function deleteDirectusNotificationItems(
  keys: Collections.DirectusNotification extends { id: number | string }
    ? Collections.DirectusNotification["id"][]
    : string[] | number[],
): ReturnType<typeof DirectusSDK.deleteNotifications<Schema>> {
  return DirectusSDK.deleteNotifications<Schema>(keys);
}

/**
 * Deletes a single known directus notifications item by id.
 */
export function deleteDirectusNotificationItem(
  key: Collections.DirectusNotification extends { id: number | string }
    ? Collections.DirectusNotification["id"]
    : string | number,
): ReturnType<typeof DirectusSDK.deleteNotification<Schema>> {
  return DirectusSDK.deleteNotification<Schema>(key);
}

/**
 * Aggregates directus notifications items.
 */
export function aggregateDirectusNotificationItems<
  Options extends Directus.AggregationOptions<Schema, "directus_notifications">,
>(
  option: Options,
): ReturnType<
  typeof DirectusSDK.aggregate<Schema, "directus_notifications", Options>
> {
  return DirectusSDK.aggregate<Schema, "directus_notifications", Options>(
    "directus_notifications",
    option,
  );
}
