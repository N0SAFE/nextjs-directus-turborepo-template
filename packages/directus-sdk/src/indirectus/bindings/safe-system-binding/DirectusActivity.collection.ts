import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";

import { ApplyFields, toSafe, ToSafeOutput } from "../../utils";

import {
  readDirectusActivityItem,
  readDirectusActivityItems,
} from "../../commands/DirectusActivity.commands";

type DirectusSDK = typeof DirectusSDK;

export class DirectusActivityItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusActivity>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusActivity,
      Query["fields"]
    >[],
  >(query?: Query): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusActivityItems(query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusActivity>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusActivity,
      Query["fields"]
    >,
  >(query?: Query): Promise<ToSafeOutput<Output | undefined>> {
    return toSafe(
      this.client
        .request(
          readDirectusActivityItems({
            ...query,
            limit: 1,
          }),
        )
        .then((items) => items?.[0]) as unknown as Promise<Output | undefined>,
    );
  }
}

export class DirectusActivityItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusActivity>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusActivity,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusActivity extends { id: number | string }
      ? Collections.DirectusActivity["id"]
      : string | number,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusActivityItem(key, query),
      ) as unknown as Promise<Output>,
    );
  }
}
