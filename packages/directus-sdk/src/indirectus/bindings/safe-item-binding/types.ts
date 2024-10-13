import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ToSafeOutput } from "../../utils";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { CollectionsType } from "../../client";

export interface TypedCollectionSingletonWrapper<Collection extends object> {
  /**
   * Reads the singleton.
   */
  read<
    const Query extends DirectusSDK.Query<CollectionsType, Collection>,
    Output = ApplyQueryFields<CollectionsType, Collection, Query["fields"]>,
  >(
    query?: Query,
  ): Promise<ToSafeOutput<Output>>;

  /**
   * Updates the singleton.
   */
  update<
    const Query extends DirectusSDK.Query<CollectionsType, Collection>,
    Output = ApplyQueryFields<CollectionsType, Collection, Query["fields"]>,
  >(
    patch: Partial<Collection>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>>;
}

export interface TypedCollectionItemsWrapper<Collection extends object> {
  /**
   * Creates many items in the collection.
   */
  create<
    const Query extends DirectusSDK.Query<CollectionsType, Collection[]>,
    Output = ApplyQueryFields<CollectionsType, Collection, Query["fields"]>[],
  >(
    items: Partial<Collection>[],
    query?: Query,
  ): Promise<ToSafeOutput<Output>>;

  /**
   * Read many items from the collection.
   */
  query<
    const Query extends DirectusSDK.Query<CollectionsType, Collection>,
    Output = ApplyQueryFields<CollectionsType, Collection, Query["fields"]>[],
  >(
    query?: Query,
  ): Promise<ToSafeOutput<Output>>;

  /**
   * Read the first item from the collection matching the query.
   */
  find<
    const Query extends DirectusSDK.Query<CollectionsType, Collection>,
    Output = ApplyQueryFields<CollectionsType, Collection, Query["fields"]>,
  >(
    query?: Query,
  ): Promise<ToSafeOutput<Output | undefined>>;

  /**
   * Update many items in the collection.
   */
  update<
    const Query extends DirectusSDK.Query<CollectionsType, Collection[]>,
    Output = ApplyQueryFields<CollectionsType, Collection, Query["fields"]>[],
  >(
    keys: string[] | number[],
    patch: Partial<Collection>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>>;

  /**
   * update many items with batch
   */
  updateBatch<
    const Query extends Directus.Query<CollectionsType, Collection[]>,
    Output = ApplyQueryFields<CollectionsType, Collection, Query["fields"]>[],
  >(
    items: Partial<Directus.UnpackList<Collection>>[],
    query?: Query,
  ): Promise<ToSafeOutput<Output>>;

  /**
   * Remove many items in the collection.
   */
  remove<Output = void>(
    keys: string[] | number[],
  ): Promise<ToSafeOutput<Output>>;
}

export interface TypedCollectionItemWrapper<Collection extends object> {
  /**
   * Create a single item in the collection.
   */
  create<
    const Query extends DirectusSDK.Query<CollectionsType, Collection>,
    Output = ApplyQueryFields<CollectionsType, Collection, Query["fields"]>,
  >(
    item: Partial<Collection>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>>;

  /**
   * Read a single item from the collection.
   */
  get<
    const Query extends DirectusSDK.Query<CollectionsType, Collection>,
    Output = ApplyQueryFields<CollectionsType, Collection, Query["fields"]>,
  >(
    key: string | number,
    query?: Query,
  ): Promise<ToSafeOutput<Output>>;

  /**
   * Update a single item from the collection.
   */
  update<
    const Query extends DirectusSDK.Query<CollectionsType, Collection>,
    Output = ApplyQueryFields<CollectionsType, Collection, Query["fields"]>,
  >(
    key: string | number,
    patch: Partial<Collection>,
    query?: Query,
  ): Promise<ToSafeOutput<Output>>;

  /**
   * Remove many items in the collection.
   */
  remove<Output = void>(key: string | number): Promise<ToSafeOutput<Output>>;
}
