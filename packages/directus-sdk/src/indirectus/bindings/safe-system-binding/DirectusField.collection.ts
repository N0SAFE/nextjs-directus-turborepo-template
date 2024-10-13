import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";

import { toSafe, ToSafeOutput } from "../../utils";
import {
  createDirectusFieldItem,
  deleteDirectusFieldItem,
  readDirectusFieldItem,
  readDirectusFieldItems,
  updateDirectusFieldItem,
} from "../../commands/DirectusField.commands";

export class DirectusFieldItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Read any items from the collection.
   */
  async query<Output = Collections.DirectusField[]>(): Promise<
    ToSafeOutput<Output>
  > {
    return toSafe(
      this.client.request(
        readDirectusFieldItems(),
      ) as unknown as Promise<Output>,
    );
  }
}

export class DirectusFieldItem {
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
    const Query extends Directus.Query<Schema, Collections.DirectusField>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusField,
      Query["fields"]
    >,
  >(
    collection: keyof Schema,
    item: Partial<Collections.DirectusField>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        createDirectusFieldItem(collection, item, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Read a single item from the collection.
   */
  async get(
    collection: keyof Schema,
    field: Directus.DirectusField<Schema>["field"],
  ): Promise<ToSafeOutput<Directus.ReadFieldOutput<Schema>>> {
    return toSafe(
      this.client.request(
        readDirectusFieldItem(collection, field),
      ) as unknown as Promise<Directus.ReadFieldOutput<Schema>>,
    );
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusField>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusField,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusField extends { collection: number | string }
      ? Collections.DirectusField["collection"]
      : string | number,
    field: Directus.DirectusField<Schema>["field"],
    patch: Partial<Collections.DirectusField>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusFieldItem(key, field, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove any items in the collection.
   */
  async remove<Output = void>(
    collection: Directus.DirectusField<Schema>["collection"],
    field: Directus.DirectusField<Schema>["field"],
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        deleteDirectusFieldItem(collection, field),
      ) as unknown as Promise<Output>,
    );
  }
}
