import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";

import { toSafe, ToSafeOutput } from "../../utils";
import {
  readDirectusSettings,
  updateDirectusSettings,
} from "../../commands/DirectusSettings.commands";

export class DirectusSettingsSingleton {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

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
  >(query?: Query): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        readDirectusSettings(query),
      ) as unknown as Promise<Output>,
    );
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
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client.request(
        updateDirectusSettings(patch, query),
      ) as unknown as Promise<Output>,
    );
  }
}
