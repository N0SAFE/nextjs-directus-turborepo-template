import type * as Directus from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";
import {
  readDirectusSettings,
  updateDirectusSettings,
} from "../../commands/DirectusSettings.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusSettingsSingleton extends ChainableBinding {
  /**
   * Read the singleton from the collection.
   */
  async read<
    const Query extends Directus.Query<Schema, Collections.DirectusSettings>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusSettings,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output> {
    return this.request(
      readDirectusSettings(query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Update the singleton from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusSettings>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusSettings,
      Query["fields"]
    >,
  >(
    patch: Partial<Collections.DirectusSettings>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusSettings(patch, query),
    ) as unknown as Promise<Output>;
  }
}
