import type * as Directus from "@directus/sdk";

import type * as DirectusSDK from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";
import {
  aggregateDirectusOperationItems,
  createDirectusOperationItem,
  createDirectusOperationItems,
  deleteDirectusOperationItem,
  deleteDirectusOperationItems,
  readDirectusOperationItem,
  readDirectusOperationItems,
  updateDirectusOperationItem,
  updateDirectusOperationItems,
} from "../../commands/DirectusOperation.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusOperationItems extends ChainableBinding {
  /**
   * Creates munknown items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<
      Schema,
      Collections.DirectusOperation
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusOperation,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusOperation>[],
    query?: Query,
  ): Promise<Output> {
    return this.request(
      createDirectusOperationItems(items, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusOperation>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusOperation,
      Query["fields"]
    >[],
  >(query?: Query): Promise<Output> {
    return this.request(
      readDirectusOperationItems(query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusOperation>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusOperation,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output | undefined> {
    return this.client
      .request(
        readDirectusOperationItems({
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
    const Query extends Directus.Query<
      Schema,
      Directus.DirectusOperation<Schema>
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusOperation,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusOperation extends { id: number | string }
      ? Collections.DirectusOperation["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusOperation>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusOperationItems(keys, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusOperation extends { id: number | string }
      ? Collections.DirectusOperation["id"][]
      : string[] | number[],
  ): Promise<Output> {
    return (await this.request(
      deleteDirectusOperationItems(keys),
    )) as unknown as Promise<Output>;
  }

  /**
   * Aggregates the items in the collection.
   */
  async aggregate<
    Options extends Directus.AggregationOptions<Schema, "directus_operations">,
    Output = Directus.AggregationOutput<
      Schema,
      "directus_operations",
      Options
    >[number],
  >(options: Options): Promise<Output> {
    return this.request(aggregateDirectusOperationItems<Options>(options)).then(
      (a) => a?.[0],
    ) as unknown as Promise<Output>;
  }
}

export class DirectusOperationItem extends ChainableBinding {
  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<Schema, Collections.DirectusOperation>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusOperation,
      Query["fields"]
    >,
  >(
    item: Partial<Collections.DirectusOperation>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      createDirectusOperationItem(item, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusOperation>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusOperation,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusOperation extends { id: number | string }
      ? Collections.DirectusOperation["id"]
      : string | number,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      readDirectusOperationItem(key, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusOperation>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusOperation,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusOperation extends { id: number | string }
      ? Collections.DirectusOperation["id"]
      : string | number,
    patch: Partial<Collections.DirectusOperation>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusOperationItem(key, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusOperation extends { id: number | string }
      ? Collections.DirectusOperation["id"]
      : string | number,
  ): Promise<Output> {
    return this.request(
      deleteDirectusOperationItem(key),
    ) as unknown as Promise<Output>;
  }
}
