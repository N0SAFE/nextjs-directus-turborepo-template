import type * as Directus from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";
import {
  aggregateDirectusCollectionItems,
  createDirectusCollectionItem,
  deleteDirectusCollectionItem,
  readDirectusCollectionItem,
  readDirectusCollectionItems,
  updateBatchDirectusCollectionItems,
  updateDirectusCollectionItem,
} from "../../commands/DirectusCollection.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusCollectionItems extends ChainableBinding {
  /**
   * Read munknown items from the collection.
   */
  async query<Output = Collections.DirectusCollection[]>(): Promise<Output> {
    return this.request(
      readDirectusCollectionItems(),
    ) as unknown as Promise<Output>;
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
  ): Promise<Output> {
    return this.request(
      updateBatchDirectusCollectionItems(items, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Aggregates the items in the collection.
   */
  async aggregate<
    Options extends Directus.AggregationOptions<Schema, "directus_collections">,
    Output = Directus.AggregationOutput<
      Schema,
      "directus_collections",
      Options
    >[number],
  >(options: Options): Promise<Output> {
    return this.request(
      aggregateDirectusCollectionItems<Options>(options),
    ).then((a) => a?.[0]) as unknown as Promise<Output>;
  }
}

export class DirectusCollectionItem extends ChainableBinding {
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
  ): Promise<Output> {
    return this.request(
      createDirectusCollectionItem(item, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read a single item from the collection.
   */
  async get<Output = ApplyQueryFields<Schema, Collections.DirectusCollection>>(
    collection: keyof Schema,
  ): Promise<Output> {
    return this.request(
      readDirectusCollectionItem(collection),
    ) as unknown as Promise<Output>;
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
  ): Promise<Output> {
    return this.request(
      updateDirectusCollectionItem(collection, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(collection: keyof Schema): Promise<Output> {
    return this.request(
      deleteDirectusCollectionItem(collection),
    ) as unknown as Promise<Output>;
  }
}
