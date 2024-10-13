import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";

import { toSafe, ToSafeOutput } from "../../utils";
import {
  createDirectusFolderItem,
  createDirectusFolderItems,
  deleteDirectusFolderItem,
  deleteDirectusFolderItems,
  readDirectusFolderItem,
  readDirectusFolderItems,
  updateDirectusFolderItem,
  updateDirectusFolderItems,
} from "../../commands/DirectusFolder.commands";

export class DirectusFolderItems {
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
    const Query extends DirectusSDK.Query<Schema, Collections.DirectusFolder>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFolder,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusFolder>[],
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        createDirectusFolderItems(items, query),
      ) as unknown as Promise<Output>,
    );
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
  >(query?: Query): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusFolderItems(query),
      ) as unknown as Promise<Output>,
    );
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
  >(query?: Query): Promise<ToSafeOutput<Output | undefined>> {
    return toSafe(
      this.client
        .request(
          readDirectusFolderItems({
            ...query,
            limit: 1,
          }),
        )
        .then((items) => items?.[0]) as unknown as Promise<Output | undefined>,
    );
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
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusFolderItems(keys, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusFolder extends { id: number | string }
      ? Collections.DirectusFolder["id"][]
      : string[] | number[],
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        deleteDirectusFolderItems(keys),
      ) as unknown as Promise<Output>,
    );
  }
}

export class DirectusFolderItem {
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
    const Query extends Directus.Query<Schema, Collections.DirectusFolder>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFolder,
      Query["fields"]
    >,
  >(
    item: Partial<Collections.DirectusFolder>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        createDirectusFolderItem(item, query),
      ) as unknown as Promise<Output>,
    );
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
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusFolderItem(key, query),
      ) as unknown as Promise<Output>,
    );
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
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusFolderItem(key, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusFolder extends { id: number | string }
      ? Collections.DirectusFolder["id"]
      : string | number,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        deleteDirectusFolderItem(key),
      ) as unknown as Promise<Output>,
    );
  }
}
