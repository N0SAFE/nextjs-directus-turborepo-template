import type * as Directus from "@directus/sdk";

import type * as DirectusSDK from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";
import {
  aggregateDirectusVersionItems,
  createDirectusVersionItem,
  createDirectusVersionItems,
  deleteDirectusVersionItem,
  deleteDirectusVersionItems,
  readDirectusVersionItem,
  readDirectusVersionItems,
  updateDirectusVersionItem,
  updateDirectusVersionItems,
} from "../../commands/DirectusVersion.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusVersionItems extends ChainableBinding {
  /**
   * Creates munknown items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<Schema, Collections.DirectusVersion>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusVersion,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusVersion>[],
    query?: Query,
  ): Promise<Output> {
    return this.request(
      createDirectusVersionItems(items, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusVersion>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusVersion,
      Query["fields"]
    >[],
  >(query?: Query): Promise<Output> {
    return this.request(
      readDirectusVersionItems(query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusVersion>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusVersion,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output | undefined> {
    return this.client
      .request(
        readDirectusVersionItems({
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
      Directus.DirectusVersion<Schema>
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusVersion,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusVersion extends { id: number | string }
      ? Collections.DirectusVersion["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusVersion>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusVersionItems(keys, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusVersion extends { id: number | string }
      ? Collections.DirectusVersion["id"][]
      : string[] | number[],
  ): Promise<Output> {
    return this.request(
      deleteDirectusVersionItems(keys),
    ) as unknown as Promise<Output>;
  }

  /**
   * Aggregates the items in the collection.
   */
  async aggregate<
    Options extends Directus.AggregationOptions<Schema, "directus_versions">,
    Output = Directus.AggregationOutput<
      Schema,
      "directus_versions",
      Options
    >[number],
  >(options: Options): Promise<Output> {
    return this.request(aggregateDirectusVersionItems<Options>(options)).then(
      (a) => a?.[0],
    ) as unknown as Promise<Output>;
  }
}

export class DirectusVersionItem extends ChainableBinding {
  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<Schema, Collections.DirectusVersion>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusVersion,
      Query["fields"]
    >,
  >(
    item: Partial<Collections.DirectusVersion>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      createDirectusVersionItem(item, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusVersion>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusVersion,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusVersion extends { id: number | string }
      ? Collections.DirectusVersion["id"]
      : string | number,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      readDirectusVersionItem(key, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusVersion>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusVersion,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusVersion extends { id: number | string }
      ? Collections.DirectusVersion["id"]
      : string | number,
    patch: Partial<Collections.DirectusVersion>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusVersionItem(key, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusVersion extends { id: number | string }
      ? Collections.DirectusVersion["id"]
      : string | number,
  ): Promise<Output> {
    return this.request(
      deleteDirectusVersionItem(key),
    ) as unknown as Promise<Output>;
  }
}
