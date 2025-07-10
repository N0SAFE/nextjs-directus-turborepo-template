import type * as Directus from "@directus/sdk";

import type * as DirectusSDK from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";
import {
  aggregateDirectusPresetItems,
  createDirectusPresetItem,
  createDirectusPresetItems,
  deleteDirectusPresetItem,
  deleteDirectusPresetItems,
  readDirectusPresetItem,
  readDirectusPresetItems,
  updateDirectusPresetItem,
  updateDirectusPresetItems,
} from "../../commands/DirectusPreset.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusPresetItems extends ChainableBinding {
  /**
   * Creates munknown items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<Schema, Collections.DirectusPreset>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPreset,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusPreset>[],
    query?: Query,
  ): Promise<Output> {
    return this.request(
      createDirectusPresetItems(items, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusPreset>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPreset,
      Query["fields"]
    >[],
  >(query?: Query): Promise<Output> {
    return this.request(
      readDirectusPresetItems(query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusPreset>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPreset,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output | undefined> {
    return this.client
      .request(
        readDirectusPresetItems({
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
    const Query extends Directus.Query<Schema, Directus.DirectusPreset<Schema>>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPreset,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusPreset extends { id: number | string }
      ? Collections.DirectusPreset["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusPreset>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusPresetItems(keys, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusPreset extends { id: number | string }
      ? Collections.DirectusPreset["id"][]
      : string[] | number[],
  ): Promise<Output> {
    return this.request(
      deleteDirectusPresetItems(keys),
    ) as unknown as Promise<Output>;
  }

  /**
   * Aggregates the items in the collection.
   */
  async aggregate<
    Options extends Directus.AggregationOptions<Schema, "directus_presets">,
    Output = Directus.AggregationOutput<
      Schema,
      "directus_presets",
      Options
    >[number],
  >(options: Options): Promise<Output> {
    return this.request(aggregateDirectusPresetItems<Options>(options)).then(
      (a) => a?.[0],
    ) as unknown as Promise<Output>;
  }
}

export class DirectusPresetItem extends ChainableBinding {
  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<Schema, Collections.DirectusPreset>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPreset,
      Query["fields"]
    >,
  >(item: Partial<Collections.DirectusPreset>, query?: Query): Promise<Output> {
    return this.request(
      createDirectusPresetItem(item, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusPreset>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPreset,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusPreset extends { id: number | string }
      ? Collections.DirectusPreset["id"]
      : string | number,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      readDirectusPresetItem(key, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusPreset>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPreset,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusPreset extends { id: number | string }
      ? Collections.DirectusPreset["id"]
      : string | number,
    patch: Partial<Collections.DirectusPreset>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusPresetItem(key, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusPreset extends { id: number | string }
      ? Collections.DirectusPreset["id"]
      : string | number,
  ): Promise<Output> {
    return this.request(
      deleteDirectusPresetItem(key),
    ) as unknown as Promise<Output>;
  }
}
