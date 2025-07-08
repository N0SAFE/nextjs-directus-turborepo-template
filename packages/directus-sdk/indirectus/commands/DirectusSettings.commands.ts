import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Collections, Schema } from "../client";

/**
 * Reads the directus settings singleton.
 */
export function readDirectusSettings<
  const Query extends Directus.Query<Schema, Collections.DirectusSettings>,
>(query?: Query): ReturnType<typeof DirectusSDK.readSettings<Schema, Query>> {
  return DirectusSDK.readSettings<Schema, Query>(query);
}

/**
 * Reads the directus settings singleton.
 */
export const getDirectusSettings = readDirectusSettings;

/**
 * Updates the directus settings singleton.
 */
export function updateDirectusSettings<
  const Query extends Directus.Query<Schema, Collections.DirectusSettings>,
>(
  patch: Partial<Collections.DirectusSettings>,
  query?: Query,
): ReturnType<typeof DirectusSDK.updateSettings<Schema, Query>> {
  return DirectusSDK.updateSettings<Schema, Query>(patch, query);
}
