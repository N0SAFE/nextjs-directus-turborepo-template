import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";

import { toSafe, ToSafeOutput } from "../../utils";
import {
  createDirectusNotificationItem,
  createDirectusNotificationItems,
  deleteDirectusNotificationItem,
  deleteDirectusNotificationItems,
  readDirectusNotificationItem,
  readDirectusNotificationItems,
  updateDirectusNotificationItem,
  updateDirectusNotificationItems,
} from "../../commands/DirectusNotification.commands";

export class DirectusNotificationItems {
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
      Collections.DirectusNotification
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusNotification,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusNotification>[],
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        createDirectusNotificationItems(items, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      Schema,
      Collections.DirectusNotification
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusNotification,
      Query["fields"]
    >[],
  >(query?: Query): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusNotificationItems(query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      Schema,
      Collections.DirectusNotification
    >,
    Output =
      | ApplyQueryFields<
          Schema,
          Collections.DirectusNotification,
          Query["fields"]
        >
      | undefined,
  >(query?: Query): Promise<ToSafeOutput<Output | undefined>> {
    return toSafe(
      this.client
        .request(
          readDirectusNotificationItems({
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
      Directus.DirectusNotification<Schema>
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusNotification,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusNotification extends { id: number | string }
      ? Collections.DirectusNotification["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusNotification>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusNotificationItems(keys, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusNotification extends { id: number | string }
      ? Collections.DirectusNotification["id"][]
      : string[] | number[],
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        deleteDirectusNotificationItems(keys),
      ) as unknown as Promise<Output>,
    );
  }
}

export class DirectusNotificationItem {
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
    const Query extends Directus.Query<
      Schema,
      Collections.DirectusNotification
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusNotification,
      Query["fields"]
    >,
  >(
    item: Partial<Collections.DirectusNotification>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        createDirectusNotificationItem(item, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      Schema,
      Collections.DirectusNotification
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusNotification,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusNotification extends { id: number | string }
      ? Collections.DirectusNotification["id"]
      : string | number,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusNotificationItem(key, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      Schema,
      Collections.DirectusNotification
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusNotification,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusNotification extends { id: number | string }
      ? Collections.DirectusNotification["id"]
      : string | number,
    patch: Partial<Collections.DirectusNotification>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusNotificationItem(key, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusNotification extends { id: number | string }
      ? Collections.DirectusNotification["id"]
      : string | number,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        deleteDirectusNotificationItem(key),
      ) as unknown as Promise<Output>,
    );
  }
}
