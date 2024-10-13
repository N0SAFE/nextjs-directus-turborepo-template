import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../types/ApplyQueryFields";

import { Collections, Schema } from "../client";

/**
 * Read many directus revisions items.
 */
export function readDirectusRevisionItems<
  const Query extends Directus.Query<
    Schema,
    DirectusSDK.DirectusRevision<Schema>
  >,
>(query?: Query): ReturnType<typeof DirectusSDK.readRevisions<Schema, Query>> {
  return DirectusSDK.readRevisions<Schema, Query>(query);
}

/**
 * Read many directus revisions items.
 */
export const listDirectusRevision = readDirectusRevisionItems;

/**
 * Gets a single known directus revisions item by id.
 */
export function readDirectusRevisionItem<
  const Query extends Directus.Query<
    Schema,
    DirectusSDK.DirectusRevision<Schema>
  >,
>(
  key: Collections.DirectusRevision extends { id: number | string }
    ? Collections.DirectusRevision["id"]
    : string | number,
  query?: Query,
): ReturnType<typeof DirectusSDK.readRevision<Schema, Query>> {
  return DirectusSDK.readRevision<Schema, Query>(key, query);
}

/**
 * Gets a single known directus revisions item by id.
 */
export const readDirectusRevision = readDirectusRevisionItem;
