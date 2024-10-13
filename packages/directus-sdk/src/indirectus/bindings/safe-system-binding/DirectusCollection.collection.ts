import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";

import { toSafe, ToSafeOutput } from "../../utils";
import {
  createDirectusCollectionItem,
  deleteDirectusCollectionItem,
  readDirectusCollectionItem,
  readDirectusCollectionItems,
  updateBatchDirectusCollectionItems,
  updateDirectusCollectionItem,
} from "../../commands/DirectusCollection.commands";

export class DirectusCollectionItems {
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
  async query<Output = Collections.DirectusCollection[]>(): Promise<
    ToSafeOutput<Output>
  > {
    return toSafe(
      this.client.request(
        readDirectusCollectionItems(),
      ) as unknown as Promise<Output>,
    );
  }

  async updateBatch<
    const Query extends Directus.Query<Schema, Directus.DirectusCollection>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusCollection,
      Query["fields"]
    >[],
  >(
    items: Directus.NestedPartial<Collections.DirectusCollection>[],
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateBatchDirectusCollectionItems(items, query),
      ) as unknown as Promise<Output>,
    );
  }
}

export class DirectusCollectionItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<Schema, Collections.DirectusCollection>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusCollection,
      Query["fields"]
    >,
  >(
    item: Partial<Collections.DirectusCollection>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        createDirectusCollectionItem(item, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Read a single item from the collection.
   */
  async get<Output = Collections.DirectusCollection>(
    collection: keyof Schema,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusCollectionItem(collection),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusCollection>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusCollection,
      Query["fields"]
    >,
  >(
    collection: keyof Schema,
    patch: Partial<Collections.DirectusCollection>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusCollectionItem(collection, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    collection: keyof Schema,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        deleteDirectusCollectionItem(collection),
      ) as unknown as Promise<Output>,
    );
  }
}
