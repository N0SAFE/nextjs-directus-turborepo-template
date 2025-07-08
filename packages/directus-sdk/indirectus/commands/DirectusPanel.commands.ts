import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Create many directus panels items.
 */
export function createDirectusPanelItems<
  const Query extends Directus.Query<Schema, Collections.DirectusPanel>,
>(
  items: Partial<Collections.DirectusPanel>[],
  query?: Query,
): ReturnType<typeof DirectusSDK.createPanels<Schema, Query>> {
  return DirectusSDK.createPanels<Schema, Query>(items, query);
}

/**
 * Create a single directus panels item.
 */
export function createDirectusPanelItem<
  const Query extends DirectusSDK.Query<Schema, Directus.DirectusPanel<Schema>>, // Is this a mistake? Why []?
>(
  item: Partial<Collections.DirectusPanel>,
  query?: Query,
): ReturnType<typeof DirectusSDK.createPanel<Schema, Query>> {
  return DirectusSDK.createPanel<Schema, Query>(item, query);
}

/**
 * Read many directus panels items.
 */
export function readDirectusPanelItems<
  const Query extends Directus.Query<Schema, Collections.DirectusPanel>,
>(query?: Query): ReturnType<typeof DirectusSDK.readPanels<Schema, Query>> {
  return DirectusSDK.readPanels<Schema, Query>(query);
}

/**
 * Read many directus panels items.
 */
export const listDirectusPanel = readDirectusPanelItems;

/**
 * Gets a single known directus panels item by id.
 */
export function readDirectusPanelItem<
  const Query extends Directus.Query<Schema, Collections.DirectusPanel>,
>(
  key: Collections.DirectusPanel extends { id: number | string }
    ? Collections.DirectusPanel["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readPanel<Schema, Query>> {
  return DirectusSDK.readPanel<Schema, Query>(key, query);
}

/**
 * Gets a single known directus panels item by id.
 */
export const readDirectusPanel = readDirectusPanelItem;

/**
 * Read many directus panels items.
 */
export function updateDirectusPanelItems<
  const Query extends Directus.Query<Schema, Collections.DirectusPanel>,
>(
  keys: Collections.DirectusPanel extends { id: number | string }
    ? Collections.DirectusPanel["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusPanel>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updatePanels<Schema, Query>> {
  return DirectusSDK.updatePanels<Schema, Query>(keys, patch, query);
}

/**
 * Gets a single known directus panels item by id.
 */
export function updateDirectusPanelItem<
  const Query extends Directus.Query<Schema, Collections.DirectusPanel>,
>(
  key: Collections.DirectusPanel extends { id: number | string }
    ? Collections.DirectusPanel["id"]
    : string | number,
  patch: Partial<Collections.DirectusPanel>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updatePanel<Schema, Query>> {
  return DirectusSDK.updatePanel<Schema, Query>(key, patch, query);
}

/**
 * Deletes many directus panels items.
 */
export function deleteDirectusPanelItems(
  keys: Collections.DirectusPanel extends { id: number | string }
    ? Collections.DirectusPanel["id"][]
    : string[] | number[],
): ReturnType<typeof DirectusSDK.deletePanels<Schema>> {
  return DirectusSDK.deletePanels<Schema>(keys);
}

/**
 * Deletes a single known directus panels item by id.
 */
export function deleteDirectusPanelItem(
  key: Collections.DirectusPanel extends { id: number | string }
    ? Collections.DirectusPanel["id"]
    : string | number,
): ReturnType<typeof DirectusSDK.deletePanel<Schema>> {
  return DirectusSDK.deletePanel<Schema>(key);
}

/**
 * Aggregates directus panels items.
 */
export function aggregateDirectusPanelItems<
  Options extends Directus.AggregationOptions<Schema, "directus_panels">,
>(
  option: Options,
): ReturnType<
  typeof DirectusSDK.aggregate<Schema, "directus_panels", Options>
> {
  return DirectusSDK.aggregate<Schema, "directus_panels", Options>(
    "directus_panels",
    option,
  );
}
