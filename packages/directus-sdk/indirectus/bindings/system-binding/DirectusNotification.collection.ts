import type * as Directus from "@directus/sdk";

import type * as DirectusSDK from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";
import {
  aggregateDirectusNotificationItems,
  createDirectusNotificationItem,
  createDirectusNotificationItems,
  deleteDirectusNotificationItem,
  deleteDirectusNotificationItems,
  readDirectusNotificationItem,
  readDirectusNotificationItems,
  updateDirectusNotificationItem,
  updateDirectusNotificationItems,
} from "../../commands/DirectusNotification.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusNotificationItems extends ChainableBinding {
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
  ): Promise<Output> {
    return this.request(
      createDirectusNotificationItems(items, query),
    ) as unknown as Promise<Output>;
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
  >(query?: Query): Promise<Output> {
    return this.request(
      readDirectusNotificationItems(query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      Schema,
      Collections.DirectusNotification
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusNotification,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output | undefined> {
    return this.client
      .request(
        readDirectusNotificationItems({
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
  ): Promise<Output> {
    return this.request(
      updateDirectusNotificationItems(keys, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusNotification extends { id: number | string }
      ? Collections.DirectusNotification["id"][]
      : string[] | number[],
  ): Promise<Output> {
    return this.request(
      deleteDirectusNotificationItems(keys),
    ) as unknown as Promise<Output>;
  }

  /**
   * Aggregates the items in the collection.
   */
  async aggregate<
    Options extends Directus.AggregationOptions<
      Schema,
      "directus_notifications"
    >,
    Output = Directus.AggregationOutput<
      Schema,
      "directus_notifications",
      Options
    >[number],
  >(options: Options): Promise<Output> {
    return this.request(
      aggregateDirectusNotificationItems<Options>(options),
    ).then((a) => a?.[0]) as unknown as Promise<Output>;
  }
}

export class DirectusNotificationItem extends ChainableBinding {
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
  ): Promise<Output> {
    return this.request(
      createDirectusNotificationItem(item, query),
    ) as unknown as Promise<Output>;
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
  ): Promise<Output> {
    return this.request(
      readDirectusNotificationItem(key, query),
    ) as unknown as Promise<Output>;
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
  ): Promise<Output> {
    return this.request(
      updateDirectusNotificationItem(key, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusNotification extends { id: number | string }
      ? Collections.DirectusNotification["id"]
      : string | number,
  ): Promise<Output> {
    return this.request(
      deleteDirectusNotificationItem(key),
    ) as unknown as Promise<Output>;
  }
}
