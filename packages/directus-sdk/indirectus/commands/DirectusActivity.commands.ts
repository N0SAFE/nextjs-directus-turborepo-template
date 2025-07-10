import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Read munknown directus activity items.
 */
export function readDirectusActivityItems<
  const Query extends Directus.Query<
    Schema,
    DirectusSDK.DirectusActivity<Schema>
  >,
>(query?: Query): ReturnType<typeof DirectusSDK.readActivities<Schema, Query>> {
  return DirectusSDK.readActivities<Schema, Query>(query);
}

/**
 * Read munknown directus activity items.
 */
export const listDirectusActivity = readDirectusActivityItems;

/**
 * Gets a single known directus activity item by id.
 */
export function readDirectusActivityItem<
  const Query extends Directus.Query<
    Schema,
    DirectusSDK.DirectusActivity<Schema>
  >,
>(
  key: Collections.DirectusActivity extends { id: number | string }
    ? Collections.DirectusActivity["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readActivity<Schema, Query>> {
  return DirectusSDK.readActivity<Schema, Query>(key, query);
}

/**
 * Gets a single known directus activity item by id.
 */
export const readDirectusActivity = readDirectusActivityItem;

/**
 * Aggregates directus activity items.
 */
export function aggregateDirectusActivityItems<
  Options extends Directus.AggregationOptions<Schema, "directus_activity">,
>(
  option: Options,
): ReturnType<
  typeof DirectusSDK.aggregate<Schema, "directus_activity", Options>
> {
  return DirectusSDK.aggregate<Schema, "directus_activity", Options>(
    "directus_activity",
    option,
  );
}
