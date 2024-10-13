import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";

import { toSafe, ToSafeOutput } from "../../utils";
import {
  createDirectusTranslationItem,
  createDirectusTranslationItems,
  deleteDirectusTranslationItem,
  deleteDirectusTranslationItems,
  readDirectusTranslationItem,
  readDirectusTranslationItems,
  updateDirectusTranslationItem,
  updateDirectusTranslationItems,
} from "../../commands/DirectusTranslation.commands";

export class DirectusTranslationItems {
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
      Collections.DirectusTranslation
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusTranslation,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusTranslation>[],
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        createDirectusTranslationItems(items, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusTranslation>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusTranslation,
      Query["fields"]
    >[],
  >(query?: Query): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusTranslationItems(query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusTranslation>,
    Output =
      | ApplyQueryFields<
          Schema,
          Collections.DirectusTranslation,
          Query["fields"]
        >
      | undefined,
  >(query?: Query): Promise<ToSafeOutput<Output | undefined>> {
    return toSafe(
      this.client
        .request(
          readDirectusTranslationItems({
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
      Directus.DirectusTranslation<Schema>
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusTranslation,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusTranslation extends { id: number | string }
      ? Collections.DirectusTranslation["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusTranslation>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusTranslationItems(keys, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusTranslation extends { id: number | string }
      ? Collections.DirectusTranslation["id"][]
      : string[] | number[],
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        deleteDirectusTranslationItems(keys),
      ) as unknown as Promise<Output>,
    );
  }
}

export class DirectusTranslationItem {
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
    const Query extends Directus.Query<Schema, Collections.DirectusTranslation>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusTranslation,
      Query["fields"]
    >,
  >(
    item: Partial<Collections.DirectusTranslation>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        createDirectusTranslationItem(item, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusTranslation>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusTranslation,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusTranslation extends { id: number | string }
      ? Collections.DirectusTranslation["id"]
      : string | number,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusTranslationItem(key, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusTranslation>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusTranslation,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusTranslation extends { id: number | string }
      ? Collections.DirectusTranslation["id"]
      : string | number,
    patch: Partial<Collections.DirectusTranslation>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusTranslationItem(key, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusTranslation extends { id: number | string }
      ? Collections.DirectusTranslation["id"]
      : string | number,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        deleteDirectusTranslationItem(key),
      ) as unknown as Promise<Output>,
    );
  }
}
