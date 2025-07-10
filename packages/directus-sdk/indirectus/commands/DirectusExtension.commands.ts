import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { Schema } from "../client";

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

/**
 * Aggregates directus extensions items.
 */
export function aggregateDirectusExtensionItems<
  Options extends Directus.AggregationOptions<Schema, "directus_extensions">,
>(
  option: Options,
): ReturnType<
  typeof DirectusSDK.aggregate<Schema, "directus_extensions", Options>
> {
  return DirectusSDK.aggregate<Schema, "directus_extensions", Options>(
    "directus_extensions",
    option,
  );
}
