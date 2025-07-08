import type * as Directus from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";
import {
  aggregateDirectusExtensionItems,
  readDirectusExtensionItems,
  updateDirectusExtensionItem,
} from "../../commands/DirectusExtension.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusExtensionItems extends ChainableBinding {
  /**
   * Read munknown items from the collection.
   */
  async query<Output = Collections.DirectusExtension[]>(): Promise<Output> {
    return this.request(
      readDirectusExtensionItems(),
    ) as unknown as Promise<Output>;
  }

  /**
   * Aggregates the items in the collection.
   */
  async aggregate<
    Options extends Directus.AggregationOptions<Schema, "directus_extensions">,
    Output = Directus.AggregationOutput<
      Schema,
      "directus_extensions",
      Options
    >[number],
  >(options: Options): Promise<Output> {
    return this.request(aggregateDirectusExtensionItems<Options>(options)).then(
      (a) => a?.[0],
    ) as unknown as Promise<Output>;
  }
}

export class DirectusExtensionItem extends ChainableBinding {
  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusExtension>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusExtension,
      Query["fields"]
    >,
  >(
    bundle: string | null,
    name: string,
    data: Directus.NestedPartial<Directus.DirectusExtension<Schema>>,
  ): Promise<Output> {
    return this.request(
      updateDirectusExtensionItem(bundle, name, data),
    ) as unknown as Promise<Output>;
  }
}
