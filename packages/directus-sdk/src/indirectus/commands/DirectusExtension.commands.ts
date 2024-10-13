import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../types/ApplyQueryFields";

import { Collections, Schema } from "../client";

/**
 * Read munknown directus extensions items.
 */
export function readDirectusExtensionItems(): ReturnType<
  typeof DirectusSDK.readExtensions<Schema>
> {
  return DirectusSDK.readExtensions<Schema>();
}

/**
 * Read munknown directus extensions items.
 */
export const listDirectusExtension = readDirectusExtensionItems;

/**
 * Gets a single known directus extensions item by id.
 */
export function updateDirectusExtensionItem(
  bundle: string | null,
  name: string,
  data: Directus.NestedPartial<Directus.DirectusExtension<Schema>>,
): ReturnType<typeof DirectusSDK.updateExtension<Schema>> {
  return DirectusSDK.updateExtension<Schema>(bundle, name, data);
}
