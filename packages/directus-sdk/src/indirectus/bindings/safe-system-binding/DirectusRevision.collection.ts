import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";

import { toSafe, ToSafeOutput } from "../../utils";
import {
  readDirectusRevisionItem,
  readDirectusRevisionItems,
} from "../../commands/DirectusRevision.commands";

export class DirectusRevisionItems {
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
    const Query extends Directus.Query<Schema, Collections.DirectusRevision>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusRevision,
      Query["fields"]
    >[],
  >(query?: Query): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusRevisionItems(query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusRevision>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusRevision,
      Query["fields"]
    >,
  >(query?: Query): Promise<ToSafeOutput<Output | undefined>> {
    return toSafe(
      this.client
        .request(
          readDirectusRevisionItems({
            ...query,
            limit: 1,
          }),
        )
        .then((items) => items?.[0]) as unknown as Promise<Output | undefined>,
    );
  }
}

export class DirectusRevisionItem {
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
    const Query extends Directus.Query<Schema, Collections.DirectusRevision>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusRevision,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusRevision extends { id: number | string }
      ? Collections.DirectusRevision["id"]
      : string | number,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusRevisionItem(key, query),
      ) as unknown as Promise<Output>,
    );
  }
}
