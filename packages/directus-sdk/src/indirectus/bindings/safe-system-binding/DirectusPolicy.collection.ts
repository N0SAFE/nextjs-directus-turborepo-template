import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";

import { toSafe, ToSafeOutput } from "../../utils";
import {
  createDirectusPolicyItem,
  createDirectusPolicyItems,
  deleteDirectusPolicyItem,
  deleteDirectusPolicyItems,
  readDirectusPolicyItem,
  readDirectusPolicyItems,
  updateDirectusPolicyItem,
  updateDirectusPolicyItems,
} from "../../commands/DirectusPolicy.commands";

export class DirectusPolicyItems {
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
    const Query extends DirectusSDK.Query<Schema, Collections.DirectusPolicy>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPolicy,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusPolicy>[],
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        createDirectusPolicyItems(items, query),
      ) as unknown as Promise<Output>,
    );
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
  >(query?: Query): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusPolicyItems(query),
      ) as unknown as Promise<Output>,
    );
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
  >(query?: Query): Promise<ToSafeOutput<Output | undefined>> {
    return toSafe(
      this.client
        .request(
          readDirectusPolicyItems({
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
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusPolicyItems(keys, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusPolicy extends { id: number | string }
      ? Collections.DirectusPolicy["id"][]
      : string[] | number[],
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        deleteDirectusPolicyItems(keys),
      ) as unknown as Promise<Output>,
    );
  }
}

export class DirectusPolicyItem {
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
    const Query extends Directus.Query<Schema, Collections.DirectusPolicy>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPolicy,
      Query["fields"]
    >,
  >(
    item: Partial<Collections.DirectusPolicy>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        createDirectusPolicyItem(item, query),
      ) as unknown as Promise<Output>,
    );
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
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusPolicyItem(key, query),
      ) as unknown as Promise<Output>,
    );
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
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusPolicyItem(key, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusPolicy extends { id: number | string }
      ? Collections.DirectusPolicy["id"]
      : string | number,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        deleteDirectusPolicyItem(key),
      ) as unknown as Promise<Output>,
    );
  }
}
