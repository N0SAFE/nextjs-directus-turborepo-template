import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";
import {
  createDirectusRelationItem,
  deleteDirectusRelationItem,
  readDirectusRelationItem,
  readDirectusRelationItems,
  updateDirectusRelationItem,
} from "../../commands/DirectusRelation.commands";

type DirectusSDK = typeof DirectusSDK;

export class DirectusRelationItems {
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
  async query<Output = Collections.DirectusRelation[]>(): Promise<Output> {
    return this.client.request(
      readDirectusRelationItems(),
    ) as unknown as Promise<Output>;
  }
}

export class DirectusRelationItem {
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
  async create<Output = Collections.DirectusRelation>(
    item: Partial<Collections.DirectusRelation>,
  ): Promise<Output> {
    return this.client.request(
      createDirectusRelationItem(item),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      Schema,
      Directus.DirectusRelation<Schema>
    >,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusRelation,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusRelation extends {
      collection: number | string;
    }
      ? Collections.DirectusRelation["collection"]
      : string | number,
    field: Directus.DirectusRelation<Schema>["field"],
  ): Promise<Output> {
    return this.client.request(
      readDirectusRelationItem(key, field),
    ) as unknown as Promise<Output>;
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusRelation>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusRelation,
      Query["fields"]
    >,
  >(
    collection: Directus.DirectusRelation<Schema>["collection"],
    field: Directus.DirectusRelation<Schema>["field"],
    patch: Partial<Collections.DirectusRelation>,
    query?: Query,
  ): Promise<Output> {
    return this.client.request(
      updateDirectusRelationItem(collection, field, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    collection: Directus.DirectusRelation<Schema>["collection"],
    field: Directus.DirectusRelation<Schema>["field"],
  ): Promise<Output> {
    return this.client.request(
      deleteDirectusRelationItem(collection, field),
    ) as unknown as Promise<Output>;
  }
}
