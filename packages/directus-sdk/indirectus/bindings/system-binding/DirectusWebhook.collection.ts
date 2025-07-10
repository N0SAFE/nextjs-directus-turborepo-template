import type * as Directus from "@directus/sdk";

import type * as DirectusSDK from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";
import {
  aggregateDirectusWebhookItems,
  createDirectusWebhookItem,
  createDirectusWebhookItems,
  deleteDirectusWebhookItem,
  deleteDirectusWebhookItems,
  readDirectusWebhookItem,
  readDirectusWebhookItems,
  updateDirectusWebhookItem,
  updateDirectusWebhookItems,
} from "../../commands/DirectusWebhook.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusWebhookItems extends ChainableBinding {
  /**
   * Creates munknown items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<Schema, Collections.DirectusWebhook>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusWebhook,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusWebhook>[],
    query?: Query,
  ): Promise<Output> {
    return this.request(
      createDirectusWebhookItems(items, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusWebhook>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusWebhook,
      Query["fields"]
    >[],
  >(query?: Query): Promise<Output> {
    return this.request(
      readDirectusWebhookItems(query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusWebhook>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusWebhook,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output | undefined> {
    return this.client
      .request(
        readDirectusWebhookItems({
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
      Directus.DirectusWebhook<Schema>
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusWebhook,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusWebhook extends { id: number | string }
      ? Collections.DirectusWebhook["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusWebhook>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusWebhookItems(keys, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusWebhook extends { id: number | string }
      ? Collections.DirectusWebhook["id"][]
      : string[] | number[],
  ): Promise<Output> {
    return this.request(
      deleteDirectusWebhookItems(keys),
    ) as unknown as Promise<Output>;
  }

  /**
   * Aggregates the items in the collection.
   */
  async aggregate<
    Options extends Directus.AggregationOptions<Schema, "directus_webhooks">,
    Output = Directus.AggregationOutput<
      Schema,
      "directus_webhooks",
      Options
    >[number],
  >(options: Options): Promise<Output> {
    return this.request(aggregateDirectusWebhookItems<Options>(options)).then(
      (a) => a?.[0],
    ) as unknown as Promise<Output>;
  }
}

export class DirectusWebhookItem extends ChainableBinding {
  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<Schema, Collections.DirectusWebhook>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusWebhook,
      Query["fields"]
    >,
  >(
    item: Partial<Collections.DirectusWebhook>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      createDirectusWebhookItem(item, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusWebhook>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusWebhook,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusWebhook extends { id: number | string }
      ? Collections.DirectusWebhook["id"]
      : string | number,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      readDirectusWebhookItem(key, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusWebhook>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusWebhook,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusWebhook extends { id: number | string }
      ? Collections.DirectusWebhook["id"]
      : string | number,
    patch: Partial<Collections.DirectusWebhook>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusWebhookItem(key, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusWebhook extends { id: number | string }
      ? Collections.DirectusWebhook["id"]
      : string | number,
  ): Promise<Output> {
    return this.request(
      deleteDirectusWebhookItem(key),
    ) as unknown as Promise<Output>;
  }
}
