import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";

import { toSafe, ToSafeOutput } from "../../utils";
import {
  createDirectusOperationItem,
  createDirectusOperationItems,
  deleteDirectusOperationItem,
  deleteDirectusOperationItems,
  readDirectusOperationItem,
  readDirectusOperationItems,
  updateDirectusOperationItem,
  updateDirectusOperationItems,
} from "../../commands/DirectusOperation.commands";

export class DirectusOperationItems {
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
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        createDirectusOperationItems(items, query),
      ) as unknown as Promise<Output>,
    );
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
  >(query?: Query): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusOperationItems(query),
      ) as unknown as Promise<Output>,
    );
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
  >(query?: Query): Promise<ToSafeOutput<Output | undefined>> {
    return toSafe(
      this.client
        .request(
          readDirectusOperationItems({
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
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusOperationItems(keys, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusOperation extends { id: number | string }
      ? Collections.DirectusOperation["id"][]
      : string[] | number[],
  ): Promise<void> {
    return await this.client.request(deleteDirectusOperationItems(keys));
  }
}

export class DirectusOperationItem {
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
    const Query extends Directus.Query<Schema, Collections.DirectusOperation>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusOperation,
      Query["fields"]
    >,
  >(
    item: Partial<Collections.DirectusOperation>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        createDirectusOperationItem(item, query),
      ) as unknown as Promise<Output>,
    );
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
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusOperationItem(key, query),
      ) as unknown as Promise<Output>,
    );
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
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusOperationItem(key, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusOperation extends { id: number | string }
      ? Collections.DirectusOperation["id"]
      : string | number,
  ): Promise<void> {
    return await this.client.request(deleteDirectusOperationItem(key));
  }
}
