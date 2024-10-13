import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";
import {
  createDirectusRoleItem,
  createDirectusRoleItems,
  deleteDirectusRoleItem,
  deleteDirectusRoleItems,
  readDirectusRoleItem,
  readDirectusRoleItems,
  updateDirectusRoleItem,
  updateDirectusRoleItems,
} from "../../commands/DirectusRole.commands";

type DirectusSDK = typeof DirectusSDK;

export class DirectusRoleItems {
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
    const Query extends DirectusSDK.Query<Schema, Collections.DirectusRole>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusRole,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusRole>[],
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      createDirectusRoleItems(items, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusRole>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusRole,
      Query["fields"]
    >[],
  >(query?: Query): Promise<Output> {
    return this.client.request(
      readDirectusRoleItems(query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusRole>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusRole,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output | undefined> {
    return this.client
      .request(
        readDirectusRoleItems({
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
    const Query extends Directus.Query<Schema, Directus.DirectusRole<Schema>>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusRole,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusRole extends { id: number | string }
      ? Collections.DirectusRole["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusRole>,
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      updateDirectusRoleItems(keys, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusRole extends { id: number | string }
      ? Collections.DirectusRole["id"][]
      : string[] | number[],
  ): Promise<Output> {
    return this.client.request(
      deleteDirectusRoleItems(keys),
    ) as unknown as Promise<Output>;
  }
}

export class DirectusRoleItem {
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
    const Query extends Directus.Query<Schema, Collections.DirectusRole>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusRole,
      Query["fields"]
    >,
  >(item: Partial<Collections.DirectusRole>, query?: Query): Promise<Output> {
    return this.client.request(
      createDirectusRoleItem(item, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusRole>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusRole,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusRole extends { id: number | string }
      ? Collections.DirectusRole["id"]
      : string | number,
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      readDirectusRoleItem(key, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusRole>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusRole,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusRole extends { id: number | string }
      ? Collections.DirectusRole["id"]
      : string | number,
    patch: Partial<Collections.DirectusRole>,
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      updateDirectusRoleItem(key, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusRole extends { id: number | string }
      ? Collections.DirectusRole["id"]
      : string | number,
  ): Promise<Output> {
    return this.client.request(
      deleteDirectusRoleItem(key),
    ) as unknown as Promise<Output>;
  }
}
