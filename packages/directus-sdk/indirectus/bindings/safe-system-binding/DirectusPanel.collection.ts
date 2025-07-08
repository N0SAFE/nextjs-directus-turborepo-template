import type * as Directus from "@directus/sdk";

import type * as DirectusSDK from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";

import { toSafe, type ToSafeOutput } from "../../utils/index";
import {
  aggregateDirectusPanelItems,
  createDirectusPanelItem,
  createDirectusPanelItems,
  deleteDirectusPanelItem,
  deleteDirectusPanelItems,
  readDirectusPanelItem,
  readDirectusPanelItems,
  updateDirectusPanelItem,
  updateDirectusPanelItems,
} from "../../commands/DirectusPanel.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusPanelItems extends ChainableBinding {
  /**
   * Creates munknown items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<Schema, Collections.DirectusPanel>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPanel,
      Query["fields"]
    >[],
  >(
    items: Partial<Collections.DirectusPanel>[],
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.request(
        createDirectusPanelItems(items, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusPanel>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPanel,
      Query["fields"]
    >[],
  >(query?: Query): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.request(readDirectusPanelItems(query)) as unknown as Promise<Output>,
    );
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusPanel>,
    Output =
      | ApplyQueryFields<Schema, Collections.DirectusPanel, Query["fields"]>
      | undefined,
  >(query?: Query): Promise<ToSafeOutput<Output | undefined>> {
    return toSafe(
      this.client
        .request(
          readDirectusPanelItems({
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
    const Query extends Directus.Query<Schema, Directus.DirectusPanel<Schema>>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPanel,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusPanel extends { id: number | string }
      ? Collections.DirectusPanel["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusPanel>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.request(
        updateDirectusPanelItems(keys, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusPanel extends { id: number | string }
      ? Collections.DirectusPanel["id"][]
      : string[] | number[],
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.request(
        deleteDirectusPanelItems(keys),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Aggregates the items in the collection.
   */
  async aggregate<
    Options extends Directus.AggregationOptions<Schema, "directus_panels">,
    Output = Directus.AggregationOutput<
      Schema,
      "directus_panels",
      Options
    >[number],
  >(options: Options): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.request(aggregateDirectusPanelItems<Options>(options)).then(
        (a) => a?.[0],
      ) as unknown as Promise<Output>,
    );
  }
}

export class DirectusPanelItem extends ChainableBinding {
  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<Schema, Collections.DirectusPanel>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPanel,
      Query["fields"]
    >,
  >(
    item: Partial<Collections.DirectusPanel>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.request(
        createDirectusPanelItem(item, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusPanel>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPanel,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusPanel extends { id: number | string }
      ? Collections.DirectusPanel["id"]
      : string | number,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.request(
        readDirectusPanelItem(key, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusPanel>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusPanel,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusPanel extends { id: number | string }
      ? Collections.DirectusPanel["id"]
      : string | number,
    patch: Partial<Collections.DirectusPanel>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.request(
        updateDirectusPanelItem(key, patch, query),
      ) as unknown as Promise<Output>,
    );
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusPanel extends { id: number | string }
      ? Collections.DirectusPanel["id"]
      : string | number,
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.request(deleteDirectusPanelItem(key)) as unknown as Promise<Output>,
    );
  }
}
