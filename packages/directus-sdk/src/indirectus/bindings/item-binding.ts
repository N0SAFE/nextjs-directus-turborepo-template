import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../types/ApplyQueryFields";

import { Collections, CollectionsType, Schema } from "../client";

export interface TypedCollectionSingletonWrapper<Collection extends object> {
  /**
   * Reads the singleton.
   */
  read<const Query extends DirectusSDK.Query<CollectionsType, Collection>>(
    query?: Query,
  ): Promise<
    ApplyQueryFields<
      CollectionsType,
      Collection,
      Query extends undefined
        ? ["*"]
        : Query["fields"] extends undefined
          ? ["*"]
          : Query["fields"] extends Readonly<any[]>
            ? Query["fields"]
            : ["*"]
    >
  >;

  /**
   * Updates the singleton.
   */
  update<const Query extends DirectusSDK.Query<CollectionsType, Collection>>(
    patch: Partial<Collection>,
    query?: Query,
  ): Promise<
    ApplyQueryFields<
      CollectionsType,
      Collection,
      Query extends undefined
        ? ["*"]
        : Query["fields"] extends undefined
          ? ["*"]
          : Query["fields"] extends Readonly<any[]>
            ? Query["fields"]
            : ["*"]
    >
  >;
}

export interface TypedCollectionItemsWrapper<Collection extends object> {
  /**
   * Creates many items in the collection.
   */
  create<const Query extends DirectusSDK.Query<CollectionsType, Collection>>(
    items: Partial<Collection>[],
    query?: Query,
  ): Promise<
    ApplyQueryFields<
      CollectionsType,
      Collection,
      Query extends undefined
        ? ["*"]
        : Query["fields"] extends undefined
          ? ["*"]
          : Query["fields"] extends Readonly<any[]>
            ? Query["fields"]
            : ["*"]
    >[]
  >;

  /**
   * Read many items from the collection.
   */
  query<const Query extends DirectusSDK.Query<CollectionsType, Collection>>(
    query?: Query,
  ): Promise<
    ApplyQueryFields<
      CollectionsType,
      Collection,
      Query extends undefined
        ? ["*"]
        : Query["fields"] extends undefined
          ? ["*"]
          : Query["fields"] extends Readonly<any[]>
            ? Query["fields"]
            : ["*"]
    >[]
  >;

  /**
   * Read the first item from the collection matching the query.
   */
  find<const Query extends DirectusSDK.Query<CollectionsType, Collection>>(
    query?: Query,
  ): Promise<
    | ApplyQueryFields<
        CollectionsType,
        Collection,
        Query extends undefined
          ? ["*"]
          : Query["fields"] extends undefined
            ? ["*"]
            : Query["fields"] extends Readonly<any[]>
              ? Query["fields"]
              : ["*"]
      >
    | undefined
  >;

  /**
   * Update many items in the collection.
   */
  update<const Query extends DirectusSDK.Query<CollectionsType, Collection[]>>(
    keys: string[] | number[],
    patch: Partial<Collection>,
    query?: Query,
  ): Promise<
    ApplyQueryFields<
      CollectionsType,
      Collection,
      Query extends undefined
        ? ["*"]
        : Query["fields"] extends undefined
          ? ["*"]
          : Query["fields"] extends Readonly<any[]>
            ? Query["fields"]
            : ["*"]
    >[]
  >;

  /**
   * Remove many items in the collection.
   */
  remove<const Query extends DirectusSDK.Query<CollectionsType, Collection>>(
    keys: string[] | number[],
  ): Promise<void>;
}

export interface TypedCollectionItemWrapper<Collection extends object> {
  /**
   * Create a single item in the collection.
   */
  create<const Query extends DirectusSDK.Query<CollectionsType, Collection>>(
    item: Partial<Collection>,
    query?: Query,
  ): Promise<
    ApplyQueryFields<
      CollectionsType,
      Collection,
      Query extends undefined
        ? ["*"]
        : Query["fields"] extends undefined
          ? ["*"]
          : Query["fields"] extends Readonly<any[]>
            ? Query["fields"]
            : ["*"]
    >
  >;

  /**
   * Read a single item from the collection.
   */
  get<const Query extends DirectusSDK.Query<CollectionsType, Collection>>(
    key: string | number,
    query?: Query,
  ): Promise<
    | ApplyQueryFields<
        CollectionsType,
        Collection,
        Query extends undefined
          ? ["*"]
          : Query["fields"] extends undefined
            ? ["*"]
            : Query["fields"] extends Readonly<any[]>
              ? Query["fields"]
              : ["*"]
      >
    | undefined
  >;

  /**
   * Update a single item from the collection.
   */
  update<const Query extends DirectusSDK.Query<CollectionsType, Collection>>(
    key: string | number,
    patch: Partial<Collection>,
    query?: Query,
  ): Promise<
    | ApplyQueryFields<
        CollectionsType,
        Collection,
        Query extends undefined
          ? ["*"]
          : Query["fields"] extends undefined
            ? ["*"]
            : Query["fields"] extends Readonly<any[]>
              ? Query["fields"]
              : ["*"]
      >
    | undefined
  >;

  /**
   * Remove many items in the collection.
   */
  remove<const Query extends DirectusSDK.Query<CollectionsType, Collection>>(
    key: string | number,
  ): Promise<void>;
}

/**
 * Helper functions
 */
