import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Create a single directus relations item.
 */
export function createDirectusRelationItem(
  item: Partial<Collections.DirectusRelation>,
): ReturnType<typeof DirectusSDK.createRelation<Schema>> {
  return DirectusSDK.createRelation<Schema>(item);
}

/**
 * Read many directus relations items.
 */
export function readDirectusRelationItems(): ReturnType<
  typeof DirectusSDK.readRelations<Schema>
> {
  return DirectusSDK.readRelations<Schema>();
}

/**
 * Read many directus relations items.
 */
export const listDirectusRelation = readDirectusRelationItems;

/**
 * Gets a single known directus relations item by id.
 */
export function readDirectusRelationItem(
  key: Collections.DirectusRelation extends { collection: number | string }
    ? Collections.DirectusRelation["collection"]
    : string | number,
  field: Directus.DirectusRelation<Schema>["field"],
): Directus.RestCommand<
  Directus.ReadRelationOutput<Schema, Directus.DirectusRelation<Schema>>,
  Schema
> {
  return DirectusSDK.readRelation(key, field);
}

/**
 * Gets a single known directus relations item by id.
 */
export const readDirectusRelation = readDirectusRelationItem;

/**
 * Gets a single known directus relations item by id.
 */
export function updateDirectusRelationItem<
  const Query extends Directus.Query<Schema, Directus.DirectusRelation<Schema>>,
>(
  collection: Directus.DirectusRelation<Schema>["collection"],
  field: Directus.DirectusRelation<Schema>["field"],
  patch: Partial<Collections.DirectusRelation>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateRelation<Schema, Query>> {
  return DirectusSDK.updateRelation<Schema, Query>(
    collection,
    field,
    patch,
    query,
  );
}

/**
 * Deletes a single known directus relations item by id.
 */
export function deleteDirectusRelationItem(
  collection: Directus.DirectusRelation<Schema>["collection"],
  field: Directus.DirectusRelation<Schema>["field"],
): ReturnType<typeof DirectusSDK.deleteRelation<Schema>> {
  return DirectusSDK.deleteRelation<Schema>(collection, field);
}

/**
 * Aggregates directus relations items.
 */
export function aggregateDirectusRelationItems<
  Options extends Directus.AggregationOptions<Schema, "directus_relations">,
>(
  option: Options,
): ReturnType<
  typeof DirectusSDK.aggregate<Schema, "directus_relations", Options>
> {
  return DirectusSDK.aggregate<Schema, "directus_relations", Options>(
    "directus_relations",
    option,
  );
}
