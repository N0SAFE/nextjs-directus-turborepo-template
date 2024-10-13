import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";

import { toSafe, ToSafeOutput } from "../../utils";
import {
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

export class DirectusMe {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

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
  >(query?: Query): Promise<ToSafeOutput<Output>> {
    return toSafe(this.client.request(readMeItem(query))) as unknown as Promise<
      ToSafeOutput<Output>
    >;
  }

  async readRoles<
    const Query extends Directus.Query<Schema, Collections.DirectusRole>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusRole,
      Query["fields"]
    >,
  >(query?: Query): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(readMeRoleItem(query)),
    ) as unknown as Promise<ToSafeOutput<Output>>;
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
  >(
    patch: Partial<Collections.DirectusUser>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(updateMeItem(patch, query)),
    ) as unknown as Promise<ToSafeOutput<Output>>;
  }
}

export class DirectusUserItems {
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
    const Query extends DirectusSDK.Query<Schema, Collections.DirectusUser>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusUser,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusUser>[],
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        createDirectusUserItems(items, query),
      ) as unknown as Promise<Output>,
    );
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
  >(query?: Query): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusUserItems(query),
      ) as unknown as Promise<Output>,
    );
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
  >(query?: Query): Promise<ToSafeOutput<Output | undefined>> {
    return toSafe(
      this.client
        .request(
          readDirectusUserItems({
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
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusUserItems(keys, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusUser extends { id: number | string }
      ? Collections.DirectusUser["id"][]
      : string[] | number[],
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        deleteDirectusUserItems(keys),
      ) as unknown as Promise<Output>,
    );
  }
}

export class DirectusUserItem {
  public Me: DirectusMe;
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {
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
  >(
    item: Partial<Collections.DirectusUser>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        createDirectusUserItem(item, query),
      ) as unknown as Promise<Output>,
    );
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
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusUserItem(key, query),
      ) as unknown as Promise<Output>,
    );
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
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusUserItem(key, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusUser extends { id: number | string }
      ? Collections.DirectusUser["id"]
      : string | number,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        deleteDirectusUserItem(key),
      ) as unknown as Promise<Output>,
    );
  }
}
