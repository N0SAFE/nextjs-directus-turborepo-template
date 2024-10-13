import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";
import {
  createDirectusPresetItem,
  createDirectusPresetItems,
  deleteDirectusPresetItem,
  deleteDirectusPresetItems,
  readDirectusPresetItem,
  readDirectusPresetItems,
  updateDirectusPresetItem,
  updateDirectusPresetItems,
} from "../../commands/DirectusPreset.commands";

type DirectusSDK = typeof DirectusSDK;

export class DirectusPresetItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

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
    return this.client.request(
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
    return this.client.request(
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
    return this.client.request(
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
    return this.client.request(
      deleteDirectusPresetItems(keys),
    ) as unknown as Promise<Output>;
  }
}

export class DirectusPresetItem {
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
    const Query extends Directus.Query<Schema, Collections.DirectusPreset>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPreset,
      Query["fields"]
    >,
  >(item: Partial<Collections.DirectusPreset>, query?: Query): Promise<Output> {
    return this.client.request(
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
    return this.client.request(
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
    return this.client.request(
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
    return this.client.request(
      deleteDirectusPresetItem(key),
    ) as unknown as Promise<Output>;
  }
}
