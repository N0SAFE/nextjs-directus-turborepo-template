import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";
import {
  createDirectusShareItem,
  createDirectusShareItems,
  deleteDirectusShareItem,
  deleteDirectusShareItems,
  readDirectusShareItem,
  readDirectusShareItems,
  updateDirectusShareItem,
  updateDirectusShareItems,
} from "../../commands/DirectusShare.commands";

type DirectusSDK = typeof DirectusSDK;

export class DirectusShareItems {
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
    const Query extends DirectusSDK.Query<Schema, Collections.DirectusShare>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusShare,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusShare>[],
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      createDirectusShareItems(items, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusShare>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusShare,
      Query["fields"]
    >[],
  >(query?: Query): Promise<Output> {
    return this.client.request(
      readDirectusShareItems(query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusShare>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusShare,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output | undefined> {
    return this.client
      .request(
        readDirectusShareItems({
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
    const Query extends Directus.Query<Schema, Directus.DirectusShare<Schema>>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusShare,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusShare extends { id: number | string }
      ? Collections.DirectusShare["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusShare>,
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      updateDirectusShareItems(keys, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusShare extends { id: number | string }
      ? Collections.DirectusShare["id"][]
      : string[] | number[],
  ): Promise<Output> {
    return this.client.request(
      deleteDirectusShareItems(keys),
    ) as unknown as Promise<Output>;
  }
}

export class DirectusShareItem {
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
    const Query extends Directus.Query<Schema, Collections.DirectusShare>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusShare,
      Query["fields"]
    >,
  >(item: Partial<Collections.DirectusShare>, query?: Query): Promise<Output> {
    return this.client.request(
      createDirectusShareItem(item, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusShare>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusShare,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusShare extends { id: number | string }
      ? Collections.DirectusShare["id"]
      : string | number,
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      readDirectusShareItem(key, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusShare>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusShare,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusShare extends { id: number | string }
      ? Collections.DirectusShare["id"]
      : string | number,
    patch: Partial<Collections.DirectusShare>,
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      updateDirectusShareItem(key, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusShare extends { id: number | string }
      ? Collections.DirectusShare["id"]
      : string | number,
  ): Promise<Output> {
    return this.client.request(
      deleteDirectusShareItem(key),
    ) as unknown as Promise<Output>;
  }
}
