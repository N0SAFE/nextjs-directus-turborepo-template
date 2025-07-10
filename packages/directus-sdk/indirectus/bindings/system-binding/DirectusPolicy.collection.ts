import type * as Directus from "@directus/sdk";

import type * as DirectusSDK from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";
import {
  aggregateDirectusPolicyItems,
  createDirectusPolicyItem,
  createDirectusPolicyItems,
  deleteDirectusPolicyItem,
  deleteDirectusPolicyItems,
  readDirectusPolicyItem,
  readDirectusPolicyItems,
  updateDirectusPolicyItem,
  updateDirectusPolicyItems,
} from "../../commands/DirectusPolicy.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusPolicyItems extends ChainableBinding {
  /**
   * Creates munknown items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<Schema, Collections.DirectusPolicy>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPolicy,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusPolicy>[],
    query?: Query,
  ): Promise<Output> {
    return this.request(
      createDirectusPolicyItems(items, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusPolicy>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPolicy,
      Query["fields"]
    >[],
  >(query?: Query): Promise<Output> {
    return this.request(
      readDirectusPolicyItems(query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusPolicy>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPolicy,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output | undefined> {
    return this.client
      .request(
        readDirectusPolicyItems({
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
    const Query extends Directus.Query<Schema, Directus.DirectusPolicy<Schema>>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPolicy,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusPolicy extends { id: number | string }
      ? Collections.DirectusPolicy["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusPolicy>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusPolicyItems(keys, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusPolicy extends { id: number | string }
      ? Collections.DirectusPolicy["id"][]
      : string[] | number[],
  ): Promise<Output> {
    return this.request(
      deleteDirectusPolicyItems(keys),
    ) as unknown as Promise<Output>;
  }

  /**
   * Aggregates the items in the collection.
   */
  async aggregate<
    Options extends Directus.AggregationOptions<Schema, "directus_policies">,
    Output = Directus.AggregationOutput<
      Schema,
      "directus_policies",
      Options
    >[number],
  >(options: Options): Promise<Output> {
    return this.request(aggregateDirectusPolicyItems<Options>(options)).then(
      (a) => a?.[0],
    ) as unknown as Promise<Output>;
  }
}

export class DirectusPolicyItem extends ChainableBinding {
  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<Schema, Collections.DirectusPolicy>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPolicy,
      Query["fields"]
    >,
  >(item: Partial<Collections.DirectusPolicy>, query?: Query): Promise<Output> {
    return this.request(
      createDirectusPolicyItem(item, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusPolicy>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPolicy,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusPolicy extends { id: number | string }
      ? Collections.DirectusPolicy["id"]
      : string | number,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      readDirectusPolicyItem(key, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusPolicy>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPolicy,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusPolicy extends { id: number | string }
      ? Collections.DirectusPolicy["id"]
      : string | number,
    patch: Partial<Collections.DirectusPolicy>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusPolicyItem(key, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusPolicy extends { id: number | string }
      ? Collections.DirectusPolicy["id"]
      : string | number,
  ): Promise<Output> {
    return this.request(
      deleteDirectusPolicyItem(key),
    ) as unknown as Promise<Output>;
  }
}
