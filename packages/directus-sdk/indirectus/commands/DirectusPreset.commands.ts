import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Create many directus presets items.
 */
export function createDirectusPresetItems<
  const Query extends Directus.Query<Schema, Collections.DirectusPreset>,
>(
  items: Partial<Collections.DirectusPreset>[],
  query?: Query,
): ReturnType<typeof DirectusSDK.createPresets<Schema, Query>> {
  return DirectusSDK.createPresets<Schema, Query>(items, query);
}

/**
 * Create a single directus presets item.
 */
export function createDirectusPresetItem<
  const Query extends DirectusSDK.Query<
    Schema,
    Directus.DirectusPreset<Schema>
  >, // Is this a mistake? Why []?
>(
  item: Partial<Collections.DirectusPreset>,
  query?: Query,
): ReturnType<typeof DirectusSDK.createPreset<Schema, Query>> {
  return DirectusSDK.createPreset<Schema, Query>(item, query);
}

/**
 * Read many directus presets items.
 */
export function readDirectusPresetItems<
  const Query extends Directus.Query<Schema, Collections.DirectusPreset>,
>(query?: Query): ReturnType<typeof DirectusSDK.readPresets<Schema, Query>> {
  return DirectusSDK.readPresets<Schema, Query>(query);
}

/**
 * Read many directus presets items.
 */
export const listDirectusPreset = readDirectusPresetItems;

/**
 * Gets a single known directus presets item by id.
 */
export function readDirectusPresetItem<
  const Query extends Directus.Query<Schema, Collections.DirectusPreset>,
>(
  key: Collections.DirectusPreset extends { id: number | string }
    ? Collections.DirectusPreset["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readPreset<Schema, Query>> {
  return DirectusSDK.readPreset<Schema, Query>(key, query);
}

/**
 * Gets a single known directus presets item by id.
 */
export const readDirectusPreset = readDirectusPresetItem;

/**
 * Read many directus presets items.
 */
export function updateDirectusPresetItems<
  const Query extends Directus.Query<Schema, Collections.DirectusPreset>,
>(
  keys: Collections.DirectusPreset extends { id: number | string }
    ? Collections.DirectusPreset["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusPreset>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updatePresets<Schema, Query>> {
  return DirectusSDK.updatePresets<Schema, Query>(keys, patch, query);
}

/**
 * Gets a single known directus presets item by id.
 */
export function updateDirectusPresetItem<
  const Query extends Directus.Query<Schema, Collections.DirectusPreset>,
>(
  key: Collections.DirectusPreset extends { id: number | string }
    ? Collections.DirectusPreset["id"]
    : string | number,
  patch: Partial<Collections.DirectusPreset>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updatePreset<Schema, Query>> {
  return DirectusSDK.updatePreset<Schema, Query>(key, patch, query);
}

/**
 * Deletes many directus presets items.
 */
export function deleteDirectusPresetItems(
  keys: Collections.DirectusPreset extends { id: number | string }
    ? Collections.DirectusPreset["id"][]
    : string[] | number[],
): ReturnType<typeof DirectusSDK.deletePresets<Schema>> {
  return DirectusSDK.deletePresets<Schema>(keys);
}

/**
 * Deletes a single known directus presets item by id.
 */
export function deleteDirectusPresetItem(
  key: Collections.DirectusPreset extends { id: number | string }
    ? Collections.DirectusPreset["id"]
    : string | number,
): ReturnType<typeof DirectusSDK.deletePreset<Schema>> {
  return DirectusSDK.deletePreset<Schema>(key);
}

/**
 * Aggregates directus presets items.
 */
export function aggregateDirectusPresetItems<
  Options extends Directus.AggregationOptions<Schema, "directus_presets">,
>(
  option: Options,
): ReturnType<
  typeof DirectusSDK.aggregate<Schema, "directus_presets", Options>
> {
  return DirectusSDK.aggregate<Schema, "directus_presets", Options>(
    "directus_presets",
    option,
  );
}
