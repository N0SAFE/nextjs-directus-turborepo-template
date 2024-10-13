import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";
import {
  createDirectusDashboardItem,
  createDirectusDashboardItems,
  deleteDirectusDashboardItem,
  deleteDirectusDashboardItems,
  readDirectusDashboardItem,
  readDirectusDashboardItems,
  updateDirectusDashboardItem,
  updateDirectusDashboardItems,
} from "../../commands/DirectusDashboard.commands";

type DirectusSDK = typeof DirectusSDK;

export class DirectusDashboardItems {
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
    const Query extends DirectusSDK.Query<
      Schema,
      Collections.DirectusDashboard
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusDashboard,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusDashboard>[],
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      createDirectusDashboardItems(items, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusDashboard>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusDashboard,
      Query["fields"]
    >[],
  >(query?: Query): Promise<Output> {
    return this.client.request(
      readDirectusDashboardItems(query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusDashboard>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusDashboard,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output | undefined> {
    return this.client
      .request(
        readDirectusDashboardItems({
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
      Directus.DirectusDashboard<Schema>
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusDashboard,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusDashboard extends { id: number | string }
      ? Collections.DirectusDashboard["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusDashboard>,
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      updateDirectusDashboardItems(keys, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusDashboard extends { id: number | string }
      ? Collections.DirectusDashboard["id"][]
      : string[] | number[],
  ): Promise<Output> {
    return this.client.request(
      deleteDirectusDashboardItems(keys),
    ) as unknown as Promise<Output>;
  }
}

export class DirectusDashboardItem {
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
    const Query extends Directus.Query<Schema, Collections.DirectusDashboard>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusDashboard,
      Query["fields"]
    >,
  >(
    item: Partial<Collections.DirectusDashboard>,
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      createDirectusDashboardItem(item, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusDashboard>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusDashboard,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusDashboard extends { id: number | string }
      ? Collections.DirectusDashboard["id"]
      : string | number,
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      readDirectusDashboardItem(key, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusDashboard>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusDashboard,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusDashboard extends { id: number | string }
      ? Collections.DirectusDashboard["id"]
      : string | number,
    patch: Partial<Collections.DirectusDashboard>,
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      updateDirectusDashboardItem(key, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusDashboard extends { id: number | string }
      ? Collections.DirectusDashboard["id"]
      : string | number,
  ): Promise<Output> {
    return this.client.request(
      deleteDirectusDashboardItem(key),
    ) as unknown as Promise<Output>;
  }
}
