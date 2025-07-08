import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Create munknown directus dashboards items.
 */
export function createDirectusDashboardItems<
  const Query extends Directus.Query<Schema, Collections.DirectusDashboard>,
>(
  items: Partial<Collections.DirectusDashboard>[],
  query?: Query,
): ReturnType<typeof DirectusSDK.createDashboards<Schema, Query>> {
  return DirectusSDK.createDashboards<Schema, Query>(items, query);
}

/**
 * Create a single directus dashboards item.
 */
export function createDirectusDashboardItem<
  const Query extends DirectusSDK.Query<
    Schema,
    Directus.DirectusDashboard<Schema>
  >, // Is this a mistake? Why []?
>(
  item: Partial<Collections.DirectusDashboard>,
  query?: Query,
): ReturnType<typeof DirectusSDK.createDashboard<Schema, Query>> {
  return DirectusSDK.createDashboard<Schema, Query>(item, query);
}

/**
 * Read munknown directus dashboards items.
 */
export function readDirectusDashboardItems<
  const Query extends Directus.Query<Schema, Collections.DirectusDashboard>,
>(query?: Query): ReturnType<typeof DirectusSDK.readDashboards<Schema, Query>> {
  return DirectusSDK.readDashboards<Schema, Query>(query);
}

/**
 * Read munknown directus dashboards items.
 */
export const listDirectusDashboard = readDirectusDashboardItems;

/**
 * Gets a single known directus dashboards item by id.
 */
export function readDirectusDashboardItem<
  const Query extends Directus.Query<Schema, Collections.DirectusDashboard>,
>(
  key: Collections.DirectusDashboard extends { id: number | string }
    ? Collections.DirectusDashboard["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readDashboard<Schema, Query>> {
  return DirectusSDK.readDashboard<Schema, Query>(key, query);
}

/**
 * Gets a single known directus dashboards item by id.
 */
export const readDirectusDashboard = readDirectusDashboardItem;

/**
 * Read munknown directus dashboards items.
 */
export function updateDirectusDashboardItems<
  const Query extends Directus.Query<Schema, Collections.DirectusDashboard>,
>(
  keys: Collections.DirectusDashboard extends { id: number | string }
    ? Collections.DirectusDashboard["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusDashboard>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateDashboards<Schema, Query>> {
  return DirectusSDK.updateDashboards<Schema, Query>(keys, patch, query);
}

/**
 * Gets a single known directus dashboards item by id.
 */
export function updateDirectusDashboardItem<
  const Query extends Directus.Query<Schema, Collections.DirectusDashboard>,
>(
  key: Collections.DirectusDashboard extends { id: number | string }
    ? Collections.DirectusDashboard["id"]
    : string | number,
  patch: Partial<Collections.DirectusDashboard>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateDashboard<Schema, Query>> {
  return DirectusSDK.updateDashboard<Schema, Query>(key, patch, query);
}

/**
 * Deletes munknown directus dashboards items.
 */
export function deleteDirectusDashboardItems(
  keys: Collections.DirectusDashboard extends { id: number | string }
    ? Collections.DirectusDashboard["id"][]
    : string[] | number[],
) {
  return DirectusSDK.deleteDashboards<Schema>(keys);
}

/**
 * Deletes a single known directus dashboards item by id.
 */
export function deleteDirectusDashboardItem(
  key: Collections.DirectusDashboard extends { id: number | string }
    ? Collections.DirectusDashboard["id"]
    : string | number,
) {
  return DirectusSDK.deleteDashboard<Schema>(key);
}

/**
 * Aggregates directus dashboards items.
 */
export function aggregateDirectusDashboardItems<
  Options extends Directus.AggregationOptions<Schema, "directus_dashboards">,
>(
  option: Options,
): ReturnType<
  typeof DirectusSDK.aggregate<Schema, "directus_dashboards", Options>
> {
  return DirectusSDK.aggregate<Schema, "directus_dashboards", Options>(
    "directus_dashboards",
    option,
  );
}
