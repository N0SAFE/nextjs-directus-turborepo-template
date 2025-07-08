import type * as Directus from "@directus/sdk";

import type * as DirectusSDK from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";

import {
  aggregateDirectusUserItems,
  createDirectusUserItem,
  createDirectusUserItems,
  deleteDirectusUserItem,
  deleteDirectusUserItems,
  readDirectusUserItem,
  readDirectusUserItems,
  readMeItem,
  readMeRoleItem,
  updateDirectusUserItem,
  updateDirectusUserItems,
  updateMeItem,
} from "../../commands/DirectusUser.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusMe extends ChainableBinding {
  /**
   * read current user.
   */
  async read<
    const Query extends Directus.Query<Schema, Collections.DirectusUser>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusUser,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output> {
    return this.request(readMeItem(query)) as unknown as Promise<Output>;
  }

  async readRoles<
    const Query extends Directus.Query<Schema, Collections.DirectusRole>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusRole,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output> {
    return this.request(readMeRoleItem(query)) as unknown as Promise<Output>;
  }

  /**
   * update current user.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusUser>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusUser,
      Query["fields"]
    >,
  >(patch: Partial<Collections.DirectusUser>, query?: Query): Promise<Output> {
    return this.request(
      updateMeItem(patch, query),
    ) as unknown as Promise<Output>;
  }
}

export class DirectusUserItems extends ChainableBinding {
  /**
   * Creates munknown items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<Schema, Collections.DirectusUser>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusUser,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusUser>[],
    query?: Query,
  ): Promise<Output> {
    return this.request(
      createDirectusUserItems(items, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusUser>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusUser,
      Query["fields"]
    >[],
  >(query?: Query): Promise<Output> {
    return this.request(
      readDirectusUserItems(query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusUser>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusUser,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output | undefined> {
    return this.client
      .request(
        readDirectusUserItems({
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
    const Query extends Directus.Query<Schema, Directus.DirectusUser<Schema>>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusUser,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusUser extends { id: number | string }
      ? Collections.DirectusUser["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusUser>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusUserItems(keys, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusUser extends { id: number | string }
      ? Collections.DirectusUser["id"][]
      : string[] | number[],
  ): Promise<Output> {
    return this.request(
      deleteDirectusUserItems(keys),
    ) as unknown as Promise<Output>;
  }

  /**
   * Aggregates the items in the collection.
   */
  async aggregate<
    Options extends Directus.AggregationOptions<Schema, "directus_users">,
    Output = Directus.AggregationOutput<
      Schema,
      "directus_users",
      Options
    >[number],
  >(options: Options): Promise<Output> {
    return this.request(aggregateDirectusUserItems<Options>(options)).then(
      (a) => a?.[0],
    ) as unknown as Promise<Output>;
  }
}

export class DirectusUserItem extends ChainableBinding {
  public Me: DirectusMe;
  /**
   *
   */
  constructor(
    client: Directus.DirectusClient<Schema> & Directus.RestClient<Schema>,
  ) {
    super(client);
    this.Me = new DirectusMe(client);
  }

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<Schema, Collections.DirectusUser>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusUser,
      Query["fields"]
    >,
  >(item: Partial<Collections.DirectusUser>, query?: Query): Promise<Output> {
    return this.request(
      createDirectusUserItem(item, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusUser>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusUser,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusUser extends { id: number | string }
      ? Collections.DirectusUser["id"]
      : string | number,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      readDirectusUserItem(key, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusUser>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusUser,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusUser extends { id: number | string }
      ? Collections.DirectusUser["id"]
      : string | number,
    patch: Partial<Collections.DirectusUser>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusUserItem(key, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusUser extends { id: number | string }
      ? Collections.DirectusUser["id"]
      : string | number,
  ): Promise<Output> {
    return this.request(
      deleteDirectusUserItem(key),
    ) as unknown as Promise<Output>;
  }
}
