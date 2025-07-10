import type * as Directus from "@directus/sdk";

import type * as DirectusSDK from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";
import {
  aggregateDirectusTranslationItems,
  createDirectusTranslationItem,
  createDirectusTranslationItems,
  deleteDirectusTranslationItem,
  deleteDirectusTranslationItems,
  readDirectusTranslationItem,
  readDirectusTranslationItems,
  updateDirectusTranslationItem,
  updateDirectusTranslationItems,
} from "../../commands/DirectusTranslation.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusTranslationItems extends ChainableBinding {
  /**
   * Creates munknown items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<
      Schema,
      Collections.DirectusTranslation
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusTranslation,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusTranslation>[],
    query?: Query,
  ): Promise<Output> {
    return this.request(
      createDirectusTranslationItems(items, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusTranslation>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusTranslation,
      Query["fields"]
    >[],
  >(query?: Query): Promise<Output> {
    return this.request(
      readDirectusTranslationItems(query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusTranslation>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusTranslation,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output | undefined> {
    return this.client
      .request(
        readDirectusTranslationItems({
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
      Directus.DirectusTranslation<Schema>
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusTranslation,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusTranslation extends { id: number | string }
      ? Collections.DirectusTranslation["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusTranslation>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusTranslationItems(keys, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusTranslation extends { id: number | string }
      ? Collections.DirectusTranslation["id"][]
      : string[] | number[],
  ): Promise<Output> {
    return this.request(
      deleteDirectusTranslationItems(keys),
    ) as unknown as Promise<Output>;
  }

  /**
   * Aggregates the items in the collection.
   */
  async aggregate<
    Options extends Directus.AggregationOptions<
      Schema,
      "directus_translations"
    >,
    Output = Directus.AggregationOutput<
      Schema,
      "directus_translations",
      Options
    >[number],
  >(options: Options): Promise<Output> {
    return this.request(
      aggregateDirectusTranslationItems<Options>(options),
    ).then((a) => a?.[0]) as unknown as Promise<Output>;
  }
}

export class DirectusTranslationItem extends ChainableBinding {
  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<Schema, Collections.DirectusTranslation>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusTranslation,
      Query["fields"]
    >,
  >(
    item: Partial<Collections.DirectusTranslation>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      createDirectusTranslationItem(item, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusTranslation>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusTranslation,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusTranslation extends { id: number | string }
      ? Collections.DirectusTranslation["id"]
      : string | number,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      readDirectusTranslationItem(key, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusTranslation>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusTranslation,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusTranslation extends { id: number | string }
      ? Collections.DirectusTranslation["id"]
      : string | number,
    patch: Partial<Collections.DirectusTranslation>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusTranslationItem(key, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusTranslation extends { id: number | string }
      ? Collections.DirectusTranslation["id"]
      : string | number,
  ): Promise<Output> {
    return this.request(
      deleteDirectusTranslationItem(key),
    ) as unknown as Promise<Output>;
  }
}
