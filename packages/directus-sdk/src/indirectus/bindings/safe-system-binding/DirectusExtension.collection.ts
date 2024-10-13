import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, CollectionsType, Schema } from "../../client";

import { toSafe, ToSafeOutput } from "../../utils";
import {
  readDirectusExtensionItems,
  updateDirectusExtensionItem,
} from "../../commands/DirectusExtension.commands";

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
  async query<Output = Collections.DirectusExtension[]>(): Promise<
    ToSafeOutput<Output>
  > {
    return toSafe(
      this.client.request(
        readDirectusExtensionItems(),
      ) as unknown as Promise<Output>,
    );
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
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusExtensionItem(bundle, name, data),
      ) as unknown as Promise<Output>,
    );
  }
}
