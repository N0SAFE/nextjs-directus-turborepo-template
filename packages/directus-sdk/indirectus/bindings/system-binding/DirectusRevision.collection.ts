import type * as Directus from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";
import {
  aggregateDirectusRevisionItems,
  readDirectusRevisionItem,
  readDirectusRevisionItems,
} from "../../commands/DirectusRevision.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusRevisionItems extends ChainableBinding {
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
  >(query?: Query): Promise<Output> {
    return this.request(
      readDirectusRevisionItems(query),
    ) as unknown as Promise<Output>;
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
  >(query?: Query): Promise<Output | undefined> {
    return this.client
      .request(
        readDirectusRevisionItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => items?.[0]) as unknown as Promise<Output | undefined>;
  }

  /**
   * Aggregates the items in the collection.
   */
  async aggregate<
    Options extends Directus.AggregationOptions<Schema, "directus_revisions">,
    Output = Directus.AggregationOutput<
      Schema,
      "directus_revisions",
      Options
    >[number],
  >(options: Options): Promise<Output> {
    return this.request(aggregateDirectusRevisionItems<Options>(options)).then(
      (a) => a?.[0],
    ) as unknown as Promise<Output>;
  }
}

export class DirectusRevisionItem extends ChainableBinding {
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
  ): Promise<Output> {
    return this.request(
      readDirectusRevisionItem(key, query),
    ) as unknown as Promise<Output>;
  }
}
