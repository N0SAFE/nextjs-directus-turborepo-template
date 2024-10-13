import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";
import {
  readDirectusExtensionItems,
  updateDirectusExtensionItem,
} from "../../commands/DirectusExtension.commands";

type DirectusSDK = typeof DirectusSDK;

export class DirectusExtensionItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Read munknown items from the collection.
   */
  async query<Output = Collections.DirectusExtension[]>(): Promise<Output> {
    return this.client.request(
      readDirectusExtensionItems(),
    ) as unknown as Promise<Output>;
  }
}

export class DirectusExtensionItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusExtension>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusExtension,
      Query["fields"]
    >,
  >(
    bundle: string | null,
    name: string,
    data: Directus.NestedPartial<Directus.DirectusExtension<Schema>>,
  ): Promise<Output> {
    return this.client.request(
      updateDirectusExtensionItem(bundle, name, data),
    ) as unknown as Promise<Output>;
  }
}
