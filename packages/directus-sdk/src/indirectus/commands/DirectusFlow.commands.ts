import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../types/ApplyQueryFields";

import { Collections, Schema } from "../client";

/**
 * Create many directus flows items.
 */
export function createDirectusFlowItems<
  const Query extends Directus.Query<Schema, Collections.DirectusFlow>,
>(
  items: Partial<Collections.DirectusFlow>[],
  query?: Query,
): ReturnType<typeof DirectusSDK.createFlows<Schema, Query>> {
  return DirectusSDK.createFlows<Schema, Query>(items, query);
}

/**
 * Create a single directus flows item.
 */
export function createDirectusFlowItem<
  const Query extends DirectusSDK.Query<Schema, Directus.DirectusFlow<Schema>>,
>(
  item: Partial<Collections.DirectusFlow>,
  query?: Query,
): ReturnType<typeof DirectusSDK.createFlow<Schema, Query>> {
  return DirectusSDK.createFlow<Schema, Query>(item, query);
}

/**
 * Read many directus flows items.
 */
export function readDirectusFlowItems<
  const Query extends Directus.Query<Schema, Collections.DirectusFlow>,
>(query?: Query): ReturnType<typeof DirectusSDK.readFlows<Schema, Query>> {
  return DirectusSDK.readFlows<Schema, Query>(query);
}

/**
 * Read many directus flows items.
 */
export const listDirectusFlow = readDirectusFlowItems;

/**
 * Gets a single known directus flows item by id.
 */
export function readDirectusFlowItem<
  const Query extends Directus.Query<Schema, Collections.DirectusFlow>,
>(
  key: Collections.DirectusFlow extends { id: number | string }
    ? Collections.DirectusFlow["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readFlow<Schema, Query>> {
  return DirectusSDK.readFlow<Schema, Query>(key, query);
}

/**
 * Gets a single known directus flows item by id.
 */
export const readDirectusFlow = readDirectusFlowItem;

/**
 * Read many directus flows items.
 */
export function updateDirectusFlowItems<
  const Query extends Directus.Query<Schema, Collections.DirectusFlow>,
>(
  keys: Collections.DirectusFlow extends { id: number | string }
    ? Collections.DirectusFlow["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusFlow>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateFlows<Schema, Query>> {
  return DirectusSDK.updateFlows<Schema, Query>(keys, patch, query);
}

/**
 * Gets a single known directus flows item by id.
 */
export function updateDirectusFlowItem<
  const Query extends Directus.Query<Schema, Collections.DirectusFlow>,
>(
  key: Collections.DirectusFlow extends { id: number | string }
    ? Collections.DirectusFlow["id"]
    : string | number,
  patch: Partial<Collections.DirectusFlow>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateFlow<Schema, Query>> {
  return DirectusSDK.updateFlow<Schema, Query>(key, patch, query);
}

/**
 * Deletes many directus flows items.
 */
export function deleteDirectusFlowItems<
  const Query extends Directus.Query<Schema, Collections.DirectusFlow>,
>(
  keys: Collections.DirectusFlow extends { id: number | string }
    ? Collections.DirectusFlow["id"][]
    : string[] | number[],
): ReturnType<typeof DirectusSDK.deleteFlows<Schema>> {
  return DirectusSDK.deleteFlows<Schema>(keys);
}

/**
 * Deletes a single known directus flows item by id.
 */
export function deleteDirectusFlowItem(
  key: Collections.DirectusFlow extends { id: number | string }
    ? Collections.DirectusFlow["id"]
    : string | number,
): ReturnType<typeof DirectusSDK.deleteFlow<Schema>> {
  return DirectusSDK.deleteFlow<Schema>(key);
}
