import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";

import { toSafe, ToSafeOutput } from "../../utils";
import {
  readDirectusPermissionItems,
  updateDirectusPermissionItems,
  createDirectusPermissionItems,
  deleteDirectusPermissionItems,
  createDirectusPermissionItem,
  readDirectusPermissionItem,
  updateDirectusPermissionItem,
  deleteDirectusPermissionItem,
} from "../../commands/DirectusPermission.commands";

export class DirectusPermissionItems {
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
      Collections.DirectusPermission
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPermission,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusPermission>[],
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        createDirectusPermissionItems(items, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusPermission>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPermission,
      Query["fields"]
    >[],
  >(query?: Query): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusPermissionItems(query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusPermission>,
    Output =
      | ApplyQueryFields<
          Schema,
          Collections.DirectusPermission,
          Query["fields"]
        >
      | undefined,
  >(query?: Query): Promise<ToSafeOutput<Output | undefined>> {
    return toSafe(
      this.client
        .request(
          readDirectusPermissionItems({
            ...query,
            limit: 1,
          }),
        )
        .then((items) => items?.[0] as unknown as Promise<Output | undefined>),
    );
  }

  /**
   * Update munknown items in the collection.
   */
  async update<
    const Query extends Directus.Query<
      Schema,
      Directus.DirectusPermission<Schema>
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPermission,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusPermission extends { id: number | string }
      ? Collections.DirectusPermission["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusPermission>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusPermissionItems(keys, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusPermission extends { id: number | string }
      ? Collections.DirectusPermission["id"][]
      : string[] | number[],
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        deleteDirectusPermissionItems(keys),
      ) as unknown as Promise<Output>,
    );
  }
}

export class DirectusPermissionItem {
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
    const Query extends Directus.Query<Schema, Collections.DirectusPermission>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPermission,
      Query["fields"]
    >,
  >(
    item: Partial<Collections.DirectusPermission>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        createDirectusPermissionItem(item, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusPermission>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPermission,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusPermission extends { id: number | string }
      ? Collections.DirectusPermission["id"]
      : string | number,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusPermissionItem(key, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusPermission>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPermission,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusPermission extends { id: number | string }
      ? Collections.DirectusPermission["id"]
      : string | number,
    patch: Partial<Collections.DirectusPermission>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusPermissionItem(key, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusPermission extends { id: number | string }
      ? Collections.DirectusPermission["id"]
      : string | number,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        deleteDirectusPermissionItem(key),
      ) as unknown as Promise<Output>,
    );
  }
}
