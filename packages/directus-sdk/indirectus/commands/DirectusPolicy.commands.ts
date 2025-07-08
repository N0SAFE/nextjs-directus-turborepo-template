import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Create many directus policies items.
 */
export function createDirectusPolicyItems<
  const Query extends Directus.Query<Schema, Collections.DirectusPolicy>,
>(
  items: Partial<Collections.DirectusPolicy>[],
  query?: Query,
): ReturnType<typeof DirectusSDK.createPolicies<Schema, Query>> {
  return DirectusSDK.createPolicies<Schema, Query>(items, query);
}

/**
 * Create a single directus policies item.
 */
export function createDirectusPolicyItem<
  const Query extends DirectusSDK.Query<
    Schema,
    Directus.DirectusPolicy<Schema>
  >, // Is this a mistake? Why []?
>(
  item: Partial<Collections.DirectusPolicy>,
  query?: Query,
): ReturnType<typeof DirectusSDK.createPolicy<Schema, Query>> {
  return DirectusSDK.createPolicy<Schema, Query>(item, query);
}

/**
 * Read many directus policies items.
 */
export function readDirectusPolicyItems<
  const Query extends Directus.Query<Schema, Collections.DirectusPolicy>,
>(query?: Query): ReturnType<typeof DirectusSDK.readPolicies<Schema, Query>> {
  return DirectusSDK.readPolicies<Schema, Query>(query);
}

/**
 * Read many directus policies items.
 */
export const listDirectusPolicy = readDirectusPolicyItems;

/**
 * Gets a single known directus policies item by id.
 */
export function readDirectusPolicyItem<
  const Query extends Directus.Query<Schema, Collections.DirectusPolicy>,
>(
  key: Collections.DirectusPolicy extends { id: number | string }
    ? Collections.DirectusPolicy["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readPolicy<Schema, Query>> {
  return DirectusSDK.readPolicy<Schema, Query>(key, query);
}

/**
 * Gets a single known directus policies item by id.
 */
export const readDirectusPolicy = readDirectusPolicyItem;

/**
 * Read many directus policies items.
 */
export function updateDirectusPolicyItems<
  const Query extends Directus.Query<Schema, Collections.DirectusPolicy>,
>(
  keys: Collections.DirectusPolicy extends { id: number | string }
    ? Collections.DirectusPolicy["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusPolicy>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updatePolicies<Schema, Query>> {
  return DirectusSDK.updatePolicies<Schema, Query>(keys, patch, query);
}

/**
 * Gets a single known directus policies item by id.
 */
export function updateDirectusPolicyItem<
  const Query extends Directus.Query<Schema, Collections.DirectusPolicy>,
>(
  key: Collections.DirectusPolicy extends { id: number | string }
    ? Collections.DirectusPolicy["id"]
    : string | number,
  patch: Partial<Collections.DirectusPolicy>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updatePolicy<Schema, Query>> {
  return DirectusSDK.updatePolicy<Schema, Query>(key, patch, query);
}

/**
 * Deletes many directus policies items.
 */
export function deleteDirectusPolicyItems(
  keys: Collections.DirectusPolicy extends { id: number | string }
    ? Collections.DirectusPolicy["id"][]
    : string[] | number[],
): ReturnType<typeof DirectusSDK.deletePolicies<Schema>> {
  return DirectusSDK.deletePolicies<Schema>(keys);
}

/**
 * Deletes a single known directus policies item by id.
 */
export function deleteDirectusPolicyItem(
  key: Collections.DirectusPolicy extends { id: number | string }
    ? Collections.DirectusPolicy["id"]
    : string | number,
): ReturnType<typeof DirectusSDK.deletePolicy<Schema>> {
  return DirectusSDK.deletePolicy<Schema>(key);
}

/**
 * Aggregates directus policies items.
 */
export function aggregateDirectusPolicyItems<
  Options extends Directus.AggregationOptions<Schema, "directus_policies">,
>(
  option: Options,
): ReturnType<
  typeof DirectusSDK.aggregate<Schema, "directus_policies", Options>
> {
  return DirectusSDK.aggregate<Schema, "directus_policies", Options>(
    "directus_policies",
    option,
  );
}
