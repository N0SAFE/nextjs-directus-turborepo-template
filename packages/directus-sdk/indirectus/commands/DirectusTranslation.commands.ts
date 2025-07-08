import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Create many directus translations items.
 */
export function createDirectusTranslationItems<
  const Query extends Directus.Query<Schema, Collections.DirectusTranslation>,
>(
  items: Partial<Collections.DirectusTranslation>[],
  query?: Query,
): ReturnType<typeof DirectusSDK.createTranslations<Schema, Query>> {
  return DirectusSDK.createTranslations<Schema, Query>(items, query);
}

/**
 * Create a single directus translations item.
 */
export function createDirectusTranslationItem<
  const Query extends DirectusSDK.Query<
    Schema,
    Directus.DirectusTranslation<Schema>
  >, // Is this a mistake? Why []?
>(
  item: Partial<Collections.DirectusTranslation>,
  query?: Query,
): ReturnType<typeof DirectusSDK.createTranslation<Schema, Query>> {
  return DirectusSDK.createTranslation<Schema, Query>(item, query);
}

/**
 * Read many directus translations items.
 */
export function readDirectusTranslationItems<
  const Query extends Directus.Query<Schema, Collections.DirectusTranslation>,
>(
  query?: Query,
): ReturnType<typeof DirectusSDK.readTranslations<Schema, Query>> {
  return DirectusSDK.readTranslations<Schema, Query>(query);
}

/**
 * Read many directus translations items.
 */
export const listDirectusTranslation = readDirectusTranslationItems;

/**
 * Gets a single known directus translations item by id.
 */
export function readDirectusTranslationItem<
  const Query extends Directus.Query<Schema, Collections.DirectusTranslation>,
>(
  key: Collections.DirectusTranslation extends { id: number | string }
    ? Collections.DirectusTranslation["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readTranslation<Schema, Query>> {
  return DirectusSDK.readTranslation<Schema, Query>(key, query);
}

/**
 * Gets a single known directus translations item by id.
 */
export const readDirectusTranslation = readDirectusTranslationItem;

/**
 * Read many directus translations items.
 */
export function updateDirectusTranslationItems<
  const Query extends Directus.Query<Schema, Collections.DirectusTranslation>,
>(
  keys: Collections.DirectusTranslation extends { id: number | string }
    ? Collections.DirectusTranslation["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusTranslation>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateTranslations<Schema, Query>> {
  return DirectusSDK.updateTranslations<Schema, Query>(keys, patch, query);
}

/**
 * Gets a single known directus translations item by id.
 */
export function updateDirectusTranslationItem<
  const Query extends Directus.Query<Schema, Collections.DirectusTranslation>,
>(
  key: Collections.DirectusTranslation extends { id: number | string }
    ? Collections.DirectusTranslation["id"]
    : string | number,
  patch: Partial<Collections.DirectusTranslation>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateTranslation<Schema, Query>> {
  return DirectusSDK.updateTranslation<Schema, Query>(key, patch, query);
}

/**
 * Deletes many directus translations items.
 */
export function deleteDirectusTranslationItems(
  keys: Collections.DirectusTranslation extends { id: number | string }
    ? Collections.DirectusTranslation["id"][]
    : string[] | number[],
): ReturnType<typeof DirectusSDK.deleteTranslations<Schema>> {
  return DirectusSDK.deleteTranslations<Schema>(keys);
}

/**
 * Deletes a single known directus translations item by id.
 */
export function deleteDirectusTranslationItem(
  key: Collections.DirectusTranslation extends { id: number | string }
    ? Collections.DirectusTranslation["id"]
    : string | number,
): ReturnType<typeof DirectusSDK.deleteTranslation<Schema>> {
  return DirectusSDK.deleteTranslation<Schema>(key);
}

/**
 * Aggregates directus translations items.
 */
export function aggregateDirectusTranslationItems<
  Options extends Directus.AggregationOptions<Schema, "directus_translations">,
>(
  option: Options,
): ReturnType<
  typeof DirectusSDK.aggregate<Schema, "directus_translations", Options>
> {
  return DirectusSDK.aggregate<Schema, "directus_translations", Options>(
    "directus_translations",
    option,
  );
}
