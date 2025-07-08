import type * as Directus from "@directus/sdk";

import type * as DirectusSDK from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";
import {
  aggregateDirectusPermissionItems,
  createDirectusPermissionItem,
  createDirectusPermissionItems,
  deleteDirectusPermissionItem,
  deleteDirectusPermissionItems,
  readDirectusPermissionItem,
  readDirectusPermissionItems,
  updateDirectusPermissionItem,
  updateDirectusPermissionItems,
} from "../../commands/DirectusPermission.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusPermissionItems extends ChainableBinding {
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
  ): Promise<Output> {
    return this.request(
      createDirectusPermissionItems(items, query),
    ) as unknown as Promise<Output>;
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
  >(query?: Query): Promise<Output> {
    return this.request(
      readDirectusPermissionItems(query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusPermission>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPermission,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output | undefined> {
    return this.client
      .request(
        readDirectusPermissionItems({
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
  ): Promise<Output> {
    return this.request(
      updateDirectusPermissionItems(keys, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusPermission extends { id: number | string }
      ? Collections.DirectusPermission["id"][]
      : string[] | number[],
  ): Promise<Output> {
    return this.request(
      deleteDirectusPermissionItems(keys),
    ) as unknown as Promise<Output>;
  }

  /**
   * Aggregates the items in the collection.
   */
  async aggregate<
    Options extends Directus.AggregationOptions<Schema, "directus_permissions">,
    Output = Directus.AggregationOutput<
      Schema,
      "directus_permissions",
      Options
    >[number],
  >(options: Options): Promise<Output> {
    return this.request(
      aggregateDirectusPermissionItems<Options>(options),
    ).then((a) => a?.[0]) as unknown as Promise<Output>;
  }
}

export class DirectusPermissionItem extends ChainableBinding {
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
  ): Promise<Output> {
    return this.request(
      createDirectusPermissionItem(item, query),
    ) as unknown as Promise<Output>;
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
  ): Promise<Output> {
    return this.request(
      readDirectusPermissionItem(key, query),
    ) as unknown as Promise<Output>;
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
  ): Promise<Output> {
    return this.request(
      updateDirectusPermissionItem(key, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusPermission extends { id: number | string }
      ? Collections.DirectusPermission["id"]
      : string | number,
  ): Promise<Output> {
    return this.request(
      deleteDirectusPermissionItem(key),
    ) as unknown as Promise<Output>;
  }
}
