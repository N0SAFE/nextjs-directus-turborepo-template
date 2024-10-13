import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";
import {
  createDirectusFlowItem,
  createDirectusFlowItems,
  deleteDirectusFlowItem,
  deleteDirectusFlowItems,
  readDirectusFlowItem,
  readDirectusFlowItems,
  updateDirectusFlowItem,
  updateDirectusFlowItems,
} from "../../commands/DirectusFlow.commands";

type DirectusSDK = typeof DirectusSDK;

export class DirectusFlowItems {
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
    const Query extends DirectusSDK.Query<Schema, Collections.DirectusFlow>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFlow,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusFlow>[],
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      createDirectusFlowItems(items, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusFlow>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFlow,
      Query["fields"]
    >[],
  >(query?: Query): Promise<Output> {
    return this.client.request(
      readDirectusFlowItems(query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusFlow>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFlow,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output | undefined> {
    return this.client
      .request(
        readDirectusFlowItems({
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
    const Query extends Directus.Query<Schema, Directus.DirectusFlow<Schema>>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFlow,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusFlow extends { id: number | string }
      ? Collections.DirectusFlow["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusFlow>,
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      updateDirectusFlowItems(keys, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusFlow extends { id: number | string }
      ? Collections.DirectusFlow["id"][]
      : string[] | number[],
  ): Promise<Output> {
    return this.client.request(
      deleteDirectusFlowItems(keys),
    ) as unknown as Promise<Output>;
  }
}

export class DirectusFlowItem {
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
    const Query extends Directus.Query<Schema, Collections.DirectusFlow>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFlow,
      Query["fields"]
    >,
  >(item: Partial<Collections.DirectusFlow>, query?: Query): Promise<Output> {
    return this.client.request(
      createDirectusFlowItem(item, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusFlow>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFlow,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusFlow extends { id: number | string }
      ? Collections.DirectusFlow["id"]
      : string | number,
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      readDirectusFlowItem(key, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusFlow>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFlow,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusFlow extends { id: number | string }
      ? Collections.DirectusFlow["id"]
      : string | number,
    patch: Partial<Collections.DirectusFlow>,
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      updateDirectusFlowItem(key, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusFlow extends { id: number | string }
      ? Collections.DirectusFlow["id"]
      : string | number,
  ): Promise<Output> {
    return this.client.request(
      deleteDirectusFlowItem(key),
    ) as unknown as Promise<Output>;
  }
}
