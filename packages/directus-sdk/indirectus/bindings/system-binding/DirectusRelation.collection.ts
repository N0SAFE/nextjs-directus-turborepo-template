import type * as Directus from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";
import {
  aggregateDirectusRelationItems,
  createDirectusRelationItem,
  deleteDirectusRelationItem,
  readDirectusRelationItem,
  readDirectusRelationItems,
  updateDirectusRelationItem,
} from "../../commands/DirectusRelation.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusRelationItems extends ChainableBinding {
  /**
   * Read munknown items from the collection.
   */
  async query<Output = Collections.DirectusRelation[]>(): Promise<Output> {
    return this.request(
      readDirectusRelationItems(),
    ) as unknown as Promise<Output>;
  }

  /**
   * Aggregates the items in the collection.
   */
  async aggregate<
    Options extends Directus.AggregationOptions<Schema, "directus_relations">,
    Output = Directus.AggregationOutput<
      Schema,
      "directus_relations",
      Options
    >[number],
  >(options: Options): Promise<Output> {
    return this.request(aggregateDirectusRelationItems<Options>(options)).then(
      (a) => a?.[0],
    ) as unknown as Promise<Output>;
  }
}

export class DirectusRelationItem extends ChainableBinding {
  /**
   * Create a single item in the collection.
   */
  async create<Output = Collections.DirectusRelation>(
    item: Partial<Collections.DirectusRelation>,
  ): Promise<Output> {
    return this.request(
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
    return this.request(
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
    return this.request(
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
    return this.request(
      deleteDirectusRelationItem(collection, field),
    ) as unknown as Promise<Output>;
  }
}
