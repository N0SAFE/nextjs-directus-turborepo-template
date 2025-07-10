import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Create many directus webhooks items.
 */
export function createDirectusWebhookItems<
  const Query extends Directus.Query<Schema, Collections.DirectusWebhook>,
>(
  items: Partial<Collections.DirectusWebhook>[],
  query?: Query,
): ReturnType<typeof DirectusSDK.createWebhooks<Schema, Query>> {
  return DirectusSDK.createWebhooks<Schema, Query>(items, query);
}

/**
 * Create a single directus webhooks item.
 */
export function createDirectusWebhookItem<
  const Query extends DirectusSDK.Query<
    Schema,
    Directus.DirectusWebhook<Schema>
  >, // Is this a mistake? Why []?
>(
  item: Partial<Collections.DirectusWebhook>,
  query?: Query,
): ReturnType<typeof DirectusSDK.createWebhook<Schema, Query>> {
  return DirectusSDK.createWebhook<Schema, Query>(item, query);
}

/**
 * Read many directus webhooks items.
 */
export function readDirectusWebhookItems<
  const Query extends Directus.Query<Schema, Collections.DirectusWebhook>,
>(query?: Query): ReturnType<typeof DirectusSDK.readWebhooks<Schema, Query>> {
  return DirectusSDK.readWebhooks<Schema, Query>(query);
}

/**
 * Read many directus webhooks items.
 */
export const listDirectusWebhook = readDirectusWebhookItems;

/**
 * Gets a single known directus webhooks item by id.
 */
export function readDirectusWebhookItem<
  const Query extends Directus.Query<Schema, Collections.DirectusWebhook>,
>(
  key: Collections.DirectusWebhook extends { id: number | string }
    ? Collections.DirectusWebhook["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readWebhook<Schema, Query>> {
  return DirectusSDK.readWebhook<Schema, Query>(key, query);
}

/**
 * Gets a single known directus webhooks item by id.
 */
export const readDirectusWebhook = readDirectusWebhookItem;

/**
 * Read many directus webhooks items.
 */
export function updateDirectusWebhookItems<
  const Query extends Directus.Query<Schema, Collections.DirectusWebhook>,
>(
  keys: Collections.DirectusWebhook extends { id: number | string }
    ? Collections.DirectusWebhook["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusWebhook>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateWebhooks<Schema, Query>> {
  return DirectusSDK.updateWebhooks<Schema, Query>(keys, patch, query);
}

/**
 * Gets a single known directus webhooks item by id.
 */
export function updateDirectusWebhookItem<
  const Query extends Directus.Query<Schema, Collections.DirectusWebhook>,
>(
  key: Collections.DirectusWebhook extends { id: number | string }
    ? Collections.DirectusWebhook["id"]
    : string | number,
  patch: Partial<Collections.DirectusWebhook>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateWebhook<Schema, Query>> {
  return DirectusSDK.updateWebhook<Schema, Query>(key, patch, query);
}

/**
 * Deletes many directus webhooks items.
 */
export function deleteDirectusWebhookItems(
  keys: Collections.DirectusWebhook extends { id: number | string }
    ? Collections.DirectusWebhook["id"][]
    : string[] | number[],
): ReturnType<typeof DirectusSDK.deleteWebhooks<Schema>> {
  return DirectusSDK.deleteWebhooks<Schema>(keys);
}

/**
 * Deletes a single known directus webhooks item by id.
 */
export function deleteDirectusWebhookItem(
  key: Collections.DirectusWebhook extends { id: number | string }
    ? Collections.DirectusWebhook["id"]
    : string | number,
): ReturnType<typeof DirectusSDK.deleteWebhook<Schema>> {
  return DirectusSDK.deleteWebhook<Schema>(key);
}

/**
 * Aggregates directus webhooks items.
 */
export function aggregateDirectusWebhookItems<
  Options extends Directus.AggregationOptions<Schema, "directus_webhooks">,
>(
  option: Options,
): ReturnType<
  typeof DirectusSDK.aggregate<Schema, "directus_webhooks", Options>
> {
  return DirectusSDK.aggregate<Schema, "directus_webhooks", Options>(
    "directus_webhooks",
    option,
  );
}
