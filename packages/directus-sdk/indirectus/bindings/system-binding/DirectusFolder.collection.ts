import type * as Directus from "@directus/sdk";

import type * as DirectusSDK from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";
import {
  aggregateDirectusFolderItems,
  createDirectusFolderItem,
  createDirectusFolderItems,
  deleteDirectusFolderItem,
  deleteDirectusFolderItems,
  readDirectusFolderItem,
  readDirectusFolderItems,
  updateDirectusFolderItem,
  updateDirectusFolderItems,
} from "../../commands/DirectusFolder.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusFolderItems extends ChainableBinding {
  /**
   * Creates munknown items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<Schema, Collections.DirectusFolder>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFolder,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusFolder>[],
    query?: Query,
  ): Promise<Output> {
    return this.request(
      createDirectusFolderItems(items, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusFolder>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFolder,
      Query["fields"]
    >[],
  >(query?: Query): Promise<Output> {
    return this.request(
      readDirectusFolderItems(query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusFolder>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFolder,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output | undefined> {
    return this.client
      .request(
        readDirectusFolderItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => items?.[0]) as unknown as Promise<Output | undefined>;
  }

  /**
   * Update munknown items in the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Directus.DirectusFolder<Schema>>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFolder,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusFolder extends { id: number | string }
      ? Collections.DirectusFolder["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusFolder>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusFolderItems(keys, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusFolder extends { id: number | string }
      ? Collections.DirectusFolder["id"][]
      : string[] | number[],
  ): Promise<Output> {
    return this.request(
      deleteDirectusFolderItems(keys),
    ) as unknown as Promise<Output>;
  }

  /**
   * Aggregates the items in the collection.
   */
  async aggregate<
    Options extends Directus.AggregationOptions<Schema, "directus_folders">,
    Output = Directus.AggregationOutput<
      Schema,
      "directus_folders",
      Options
    >[number],
  >(options: Options): Promise<Output> {
    return this.request(aggregateDirectusFolderItems<Options>(options)).then(
      (a) => a?.[0],
    ) as unknown as Promise<Output>;
  }
}

export class DirectusFolderItem extends ChainableBinding {
  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<Schema, Collections.DirectusFolder>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFolder,
      Query["fields"]
    >,
  >(item: Partial<Collections.DirectusFolder>, query?: Query): Promise<Output> {
    return this.request(
      createDirectusFolderItem(item, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusFolder>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFolder,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusFolder extends { id: number | string }
      ? Collections.DirectusFolder["id"]
      : string | number,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      readDirectusFolderItem(key, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusFolder>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFolder,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusFolder extends { id: number | string }
      ? Collections.DirectusFolder["id"]
      : string | number,
    patch: Partial<Collections.DirectusFolder>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusFolderItem(key, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusFolder extends { id: number | string }
      ? Collections.DirectusFolder["id"]
      : string | number,
  ): Promise<Output> {
    return this.request(
      deleteDirectusFolderItem(key),
    ) as unknown as Promise<Output>;
  }
}
