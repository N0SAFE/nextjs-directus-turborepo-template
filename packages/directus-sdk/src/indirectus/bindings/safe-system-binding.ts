import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../types/ApplyQueryFields";

import { Collections, CollectionsType, Schema } from "../client";

type DirectusSDK = typeof DirectusSDK;

const toSafe = <Output,>(promise: Promise<Output>) => {
  return promise
    .then(
      (data) =>
        ({ data, isError: false }) as {
          data: typeof data;
          isError: false;
          error: never;
        },
    )
    .catch(
      (error) =>
        ({ error, isError: true }) as {
          error: Error;
          isError: true;
          data: never;
        },
    );
};

/**
 * Read many directus activity items.
 */
export function readDirectusActivityItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusActivity
  >,
>(query?: Query) {
  return DirectusSDK.readActivities<CollectionsType, Query>(query);
}

/**
 * Read many directus activity items.
 */
export const listDirectusActivity = readDirectusActivityItems;

/**
 * Gets a single known directus activity item by id.
 */
export function readDirectusActivityItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusActivity
  >,
>(
  key: Collections.DirectusActivity extends { id: number | string }
    ? Collections.DirectusActivity["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readActivity<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus activity item by id.
 */
export const readDirectusActivity = readDirectusActivityItem;

export class DirectusActivityItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusActivity
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusActivity,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusActivityItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusActivity
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusActivity,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusActivityItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }
}

export class DirectusActivityItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusActivity
    >,
  >(
    key: Collections.DirectusActivity extends { id: number | string }
      ? Collections.DirectusActivity["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusActivity,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusActivityItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }
}

/**
 * Create a single directus collections item.
 */
export function createDirectusCollectionItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Directus.DirectusCollection<CollectionsType>
  >, // Is this a mistake? Why []?
>(item: Partial<Collections.DirectusCollection>, query?: Query) {
  return DirectusSDK.createCollection<CollectionsType, Query>(item, query);
}

/**
 * Read many directus collections items.
 */
export function readDirectusCollectionItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusCollection
  >,
>(query?: Query) {
  return DirectusSDK.readCollections<CollectionsType>();
}

/**
 * Read many directus collections items.
 */
export const listDirectusCollection = readDirectusCollectionItems;

/**
 * Gets a single known directus collections item by id.
 */
export function readDirectusCollectionItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusCollection
  >,
>(
  key: Collections.DirectusCollection extends { collection: number | string }
    ? Collections.DirectusCollection["collection"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readCollection<CollectionsType>(key);
}

/**
 * Gets a single known directus collections item by id.
 */
export const readDirectusCollection = readDirectusCollectionItem;

/**
 * Gets a single known directus collections item by id.
 */
export function updateDirectusCollectionItem<
  const Query extends Directus.Query<
    CollectionsType,
    Directus.DirectusCollection<CollectionsType>
  >,
>(
  collection: keyof CollectionsType,
  patch: Partial<Collections.DirectusCollection>,
  query?: Query,
) {
  return DirectusSDK.updateCollection<CollectionsType, Query>(
    collection,
    patch,
    query,
  );
}

/**
 * updates many directus collections items.
 */
export function updateBatchDirectusCollectionItems<
  const Query extends Directus.Query<
    CollectionsType,
    Directus.DirectusCollection<CollectionsType>
  >,
>(
  items: Directus.NestedPartial<Collections.DirectusCollection>[],
  query?: Query,
) {
  return DirectusSDK.updateCollectionsBatch<CollectionsType, Query>(
    items,
    query,
  );
}

/**
 * Deletes a single known directus collections item by id.
 */
export function deleteDirectusCollectionItem(
  key: Collections.DirectusCollection extends { collection: number | string }
    ? Collections.DirectusCollection["collection"]
    : string | number,
) {
  return DirectusSDK.deleteCollection<CollectionsType>(key);
}

export class DirectusCollectionItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusCollection
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusCollection,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusCollectionItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  async updateBatch<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusCollection
    >,
  >(
    items: Directus.NestedPartial<Collections.DirectusCollection>[],
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusCollection,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return (await toSafe(
      this.client.request(updateBatchDirectusCollectionItems(items, query)),
    )) as any; // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusCollection
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusCollection,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusCollectionItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }
}

export class DirectusCollectionItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusCollection
    >,
  >(
    item: Partial<Collections.DirectusCollection>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusCollection,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusCollectionItem(item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusCollection
    >,
  >(
    collection: keyof CollectionsType,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusCollection,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusCollectionItem(collection, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusCollection
    >,
  >(
    collection: keyof CollectionsType,
    patch: Partial<Collections.DirectusCollection>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusCollection,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusCollectionItem(collection, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusCollection
    >,
  >(collection: keyof CollectionsType): Promise<void> {
    return await this.client.request(deleteDirectusCollectionItem(collection));
  }
}

/**
 * Create a single directus fields item.
 */
export function createDirectusFieldItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Directus.DirectusField<CollectionsType>
  >, // Is this a mistake? Why []?
>(
  collection: keyof CollectionsType,
  item: Partial<Collections.DirectusField>,
  query?: Query,
) {
  return DirectusSDK.createField<CollectionsType, Query>(
    collection,
    item,
    query,
  );
}

/**
 * Read many directus fields items.
 */
export function readDirectusFieldItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusField
  >,
>(query?: Query) {
  return DirectusSDK.readFields<CollectionsType>();
}

/**
 * Read many directus fields items.
 */
export const listDirectusField = readDirectusFieldItems;

/**
 * Gets a single known directus fields item by id.
 */
export function readDirectusFieldItem(
  collection: keyof CollectionsType,
  field: Directus.DirectusField<CollectionsType>["field"],
) {
  return DirectusSDK.readField<CollectionsType>(collection, field);
}

/**
 * Gets a single known directus fields item by id.
 */
export const readDirectusField = readDirectusFieldItem;

/**
 * Gets a single known directus fields item by id.
 */
export function updateDirectusFieldItem<
  const Query extends Directus.Query<
    CollectionsType,
    Directus.DirectusField<CollectionsType>
  >,
>(
  key: Collections.DirectusField extends { collection: number | string }
    ? Collections.DirectusField["collection"]
    : string | number,
  field: Directus.DirectusField<CollectionsType>["field"],
  patch: Partial<Collections.DirectusField>,
  query?: Query,
) {
  return DirectusSDK.updateField<CollectionsType, Query>(
    key,
    field,
    patch,
    query,
  );
}

/**
 * Deletes a single known directus fields item by id.
 */
export function deleteDirectusFieldItem(
  collection: Directus.DirectusField<CollectionsType>["collection"],
  field: Directus.DirectusField<CollectionsType>["field"],
) {
  return DirectusSDK.deleteField<CollectionsType>(collection, field);
}

export class DirectusFieldItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusField
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusField,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusFieldItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusField
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusField,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusFieldItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }
}

export class DirectusFieldItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusField
    >,
  >(
    collection: keyof CollectionsType,
    item: Partial<Collections.DirectusField>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusField,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusFieldItem(collection, item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get(
    collection: keyof CollectionsType,
    field: Directus.DirectusField<CollectionsType>["field"],
  ): Promise<Directus.ReadFieldOutput<CollectionsType>> {
    return this.client
      .request(readDirectusFieldItem(collection, field))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusField
    >,
  >(
    key: Collections.DirectusField extends { collection: number | string }
      ? Collections.DirectusField["collection"]
      : string | number,
    field: Directus.DirectusField<CollectionsType>["field"],
    patch: Partial<Collections.DirectusField>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusField,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusFieldItem(key, field, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusField
    >,
  >(
    collection: Directus.DirectusField<CollectionsType>["collection"],
    field: Directus.DirectusField<CollectionsType>["field"],
  ): Promise<void> {
    return await this.client.request(
      deleteDirectusFieldItem(collection, field),
    );
  }
}

/**
 * Read many directus files items.
 */
export function readDirectusFileItems<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusFile>,
>(query?: Query) {
  return DirectusSDK.readFiles<CollectionsType, Query>(query);
}

/**
 * Read many directus files items.
 */
export const listDirectusFile = readDirectusFileItems;

/**
 * Gets a single known directus files item by id.
 */
export function readDirectusFileItem<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusFile>,
>(
  key: Collections.DirectusFile extends { id: number | string }
    ? Collections.DirectusFile["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readFile<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus files item by id.
 */
export const readDirectusFile = readDirectusFileItem;

/**
 * read file as array buffer
 */
export function readDirectusFileArrayBuffer(
  key: Collections.DirectusFile extends { id: number | string }
    ? Collections.DirectusFile["id"]
    : string | number,
  query?: Directus.AssetsQuery,
) {
  return DirectusSDK.readAssetArrayBuffer<CollectionsType>(key, query);
}

/**
 * read file as blob
 */
export function readDirectusFileBlob(
  key: Collections.DirectusFile extends { id: number | string }
    ? Collections.DirectusFile["id"]
    : string | number,
  query?: Directus.AssetsQuery,
) {
  return DirectusSDK.readAssetBlob<CollectionsType>(key, query);
}

/**
 * read file as readable stream
 */
export function readDirectusFileStream(
  key: Collections.DirectusFile extends { id: number | string }
    ? Collections.DirectusFile["id"]
    : string | number,
  query?: Directus.AssetsQuery,
) {
  return DirectusSDK.readAssetRaw<CollectionsType>(key, query);
}

/**
 * Read many directus files items.
 */
export function updateDirectusFileItems<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusFile>,
>(
  keys: Collections.DirectusFile extends { id: number | string }
    ? Collections.DirectusFile["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusFile>,
  query?: Query,
) {
  return DirectusSDK.updateFiles<CollectionsType, Query>(keys, patch, query);
}

export function updateBatchDirectusFileItems<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusFile>,
>(items: Directus.NestedPartial<Collections.DirectusFile>[], query?: Query) {
  return DirectusSDK.updateFilesBatch<CollectionsType, Query>(items, query);
}

/**
 * Gets a single known directus files item by id.
 */
export function updateDirectusFileItem<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusFile>,
>(
  key: Collections.DirectusFile extends { id: number | string }
    ? Collections.DirectusFile["id"]
    : string | number,
  patch: Partial<Collections.DirectusFile>,
  query?: Query,
) {
  return DirectusSDK.updateFile<CollectionsType, Query>(key, patch, query);
}

/**
 * Deletes many directus files items.
 */
export function deleteDirectusFileItems<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusFile>,
>(
  keys: Collections.DirectusFile extends { id: number | string }
    ? Collections.DirectusFile["id"][]
    : string[] | number[],
) {
  return DirectusSDK.deleteFiles<CollectionsType>(keys);
}

/**
 * Deletes a single known directus files item by id.
 */
export function deleteDirectusFileItem(
  key: Collections.DirectusFile extends { id: number | string }
    ? Collections.DirectusFile["id"]
    : string | number,
) {
  return DirectusSDK.deleteFile<CollectionsType>(key);
}

export class DirectusFileItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFile
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusFile,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusFileItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFile
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusFile,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusFileItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update many items in the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusFile<CollectionsType>
    >,
  >(
    keys: Collections.DirectusFile extends { id: number | string }
      ? Collections.DirectusFile["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusFile>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusFile,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusFileItems(keys, patch, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Update many items in the collection with batch.
   */
  async updateBatch<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusFile<CollectionsType>
    >,
  >(
    items: Directus.NestedPartial<Collections.DirectusFile>[],
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusFile,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return (await toSafe(
      this.client.request(updateBatchDirectusFileItems(items, query)),
    )) as any; // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFile
    >,
  >(
    keys: Collections.DirectusFile extends { id: number | string }
      ? Collections.DirectusFile["id"][]
      : string[] | number[],
  ): Promise<void> {
    return await this.client.request(deleteDirectusFileItems(keys));
  }
}

export class DirectusFileItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFile
    >,
  >(
    key: Collections.DirectusFile extends { id: number | string }
      ? Collections.DirectusFile["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusFile,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusFileItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * read file as array buffer
   */
  async readArrayBuffer(
    key: Collections.DirectusFile extends { id: number | string }
      ? Collections.DirectusFile["id"]
      : string | number,
    query?: Directus.AssetsQuery,
  ) {
    return await toSafe(
      this.client.request(readDirectusFileArrayBuffer(key, query)),
    );
  }

  /**
   * read file as blob
   */
  async readBlob(
    key: Collections.DirectusFile extends { id: number | string }
      ? Collections.DirectusFile["id"]
      : string | number,
    query?: Directus.AssetsQuery,
  ) {
    return await toSafe(this.client.request(readDirectusFileBlob(key, query)));
  }

  /**
   * read file as readable stream
   */
  async readStream(
    key: Collections.DirectusFile extends { id: number | string }
      ? Collections.DirectusFile["id"]
      : string | number,
    query?: Directus.AssetsQuery,
  ) {
    return await toSafe(
      this.client.request(readDirectusFileStream(key, query)),
    );
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFile
    >,
  >(
    key: Collections.DirectusFile extends { id: number | string }
      ? Collections.DirectusFile["id"]
      : string | number,
    patch: Partial<Collections.DirectusFile>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusFile,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusFileItem(key, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFile
    >,
  >(
    key: Collections.DirectusFile extends { id: number | string }
      ? Collections.DirectusFile["id"]
      : string | number,
  ): Promise<void> {
    return await this.client.request(deleteDirectusFileItem(key));
  }
}

/**
 * Create many directus folders items.
 */
export function createDirectusFolderItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusFolder
  >,
>(items: Partial<Collections.DirectusFolder>[], query?: Query) {
  return DirectusSDK.createFolders<CollectionsType, Query>(items, query);
}

/**
 * Create a single directus folders item.
 */
export function createDirectusFolderItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Directus.DirectusFolder<CollectionsType>
  >, // Is this a mistake? Why []?
>(item: Partial<Collections.DirectusFolder>, query?: Query) {
  return DirectusSDK.createFolder<CollectionsType, Query>(item, query);
}

/**
 * Read many directus folders items.
 */
export function readDirectusFolderItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusFolder
  >,
>(query?: Query) {
  return DirectusSDK.readFolders<CollectionsType, Query>(query);
}

/**
 * Read many directus folders items.
 */
export const listDirectusFolder = readDirectusFolderItems;

/**
 * Gets a single known directus folders item by id.
 */
export function readDirectusFolderItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusFolder
  >,
>(
  key: Collections.DirectusFolder extends { id: number | string }
    ? Collections.DirectusFolder["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readFolder<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus folders item by id.
 */
export const readDirectusFolder = readDirectusFolderItem;

/**
 * Read many directus folders items.
 */
export function updateDirectusFolderItems<
  const Query extends Directus.Query<
    CollectionsType,
    Directus.DirectusFolder<CollectionsType>
  >,
>(
  keys: Collections.DirectusFolder extends { id: number | string }
    ? Collections.DirectusFolder["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusFolder>,
  query?: Query,
) {
  return DirectusSDK.updateFolders<CollectionsType, Query>(keys, patch, query);
}

/**
 * Gets a single known directus folders item by id.
 */
export function updateDirectusFolderItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusFolder
  >,
>(
  key: Collections.DirectusFolder extends { id: number | string }
    ? Collections.DirectusFolder["id"]
    : string | number,
  patch: Partial<Collections.DirectusFolder>,
  query?: Query,
) {
  return DirectusSDK.updateFolder<CollectionsType, Query>(key, patch, query);
}

/**
 * Deletes many directus folders items.
 */
export function deleteDirectusFolderItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusFolder
  >,
>(
  keys: Collections.DirectusFolder extends { id: number | string }
    ? Collections.DirectusFolder["id"][]
    : string[] | number[],
) {
  return DirectusSDK.deleteFolders<CollectionsType>(keys);
}

/**
 * Deletes a single known directus folders item by id.
 */
export function deleteDirectusFolderItem(
  key: Collections.DirectusFolder extends { id: number | string }
    ? Collections.DirectusFolder["id"]
    : string | number,
) {
  return DirectusSDK.deleteFolder<CollectionsType>(key);
}

export class DirectusFolderItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Creates many items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<
      CollectionsType,
      Collections.DirectusFolder
    >,
  >(
    items: Partial<Collections.DirectusFolder>[],
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusFolder,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusFolderItems(items, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFolder
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusFolder,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusFolderItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFolder
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusFolder,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusFolderItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update many items in the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusFolder<CollectionsType>
    >,
  >(
    keys: Collections.DirectusFolder extends { id: number | string }
      ? Collections.DirectusFolder["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusFolder>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusFolder,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusFolderItems(keys, patch, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFolder
    >,
  >(
    keys: Collections.DirectusFolder extends { id: number | string }
      ? Collections.DirectusFolder["id"][]
      : string[] | number[],
  ): Promise<void> {
    return await this.client.request(deleteDirectusFolderItems(keys));
  }
}

export class DirectusFolderItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFolder
    >,
  >(
    item: Partial<Collections.DirectusFolder>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusFolder,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusFolderItem(item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFolder
    >,
  >(
    key: Collections.DirectusFolder extends { id: number | string }
      ? Collections.DirectusFolder["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusFolder,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusFolderItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFolder
    >,
  >(
    key: Collections.DirectusFolder extends { id: number | string }
      ? Collections.DirectusFolder["id"]
      : string | number,
    patch: Partial<Collections.DirectusFolder>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusFolder,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusFolderItem(key, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFolder
    >,
  >(
    key: Collections.DirectusFolder extends { id: number | string }
      ? Collections.DirectusFolder["id"]
      : string | number,
  ): Promise<void> {
    return await this.client.request(deleteDirectusFolderItem(key));
  }
}

/**
 * Create many directus permissions items.
 */
export function createDirectusPermissionItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPermission
  >,
>(items: Partial<Collections.DirectusPermission>[], query?: Query) {
  return DirectusSDK.createPermissions<CollectionsType, Query>(items, query);
}

/**
 * Create a single directus permissions item.
 */
export function createDirectusPermissionItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Directus.DirectusPermission<CollectionsType>
  >, // Is this a mistake? Why []?
>(item: Partial<Collections.DirectusPermission>, query?: Query) {
  return DirectusSDK.createPermission<CollectionsType, Query>(item, query);
}

/**
 * Read many directus permissions items.
 */
export function readDirectusPermissionItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPermission
  >,
>(query?: Query) {
  return DirectusSDK.readPermissions<CollectionsType, Query>(query);
}

/**
 * Read many directus permissions items.
 */
export const listDirectusPermission = readDirectusPermissionItems;

/**
 * Gets a single known directus permissions item by id.
 */
export function readDirectusPermissionItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPermission
  >,
>(
  key: Collections.DirectusPermission extends { id: number | string }
    ? Collections.DirectusPermission["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readPermission<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus permissions item by id.
 */
export const readDirectusPermission = readDirectusPermissionItem;

/**
 * Read many directus permissions items.
 */
export function updateDirectusPermissionItems<
  const Query extends Directus.Query<
    CollectionsType,
    Directus.DirectusPermission<CollectionsType>
  >,
>(
  keys: Collections.DirectusPermission extends { id: number | string }
    ? Collections.DirectusPermission["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusPermission>,
  query?: Query,
) {
  return DirectusSDK.updatePermissions<CollectionsType, Query>(
    keys,
    patch,
    query,
  );
}

/**
 * Gets a single known directus permissions item by id.
 */
export function updateDirectusPermissionItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPermission
  >,
>(
  key: Collections.DirectusPermission extends { id: number | string }
    ? Collections.DirectusPermission["id"]
    : string | number,
  patch: Partial<Collections.DirectusPermission>,
  query?: Query,
) {
  return DirectusSDK.updatePermission<CollectionsType, Query>(
    key,
    patch,
    query,
  );
}

/**
 * Deletes many directus permissions items.
 */
export function deleteDirectusPermissionItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPermission
  >,
>(
  keys: Collections.DirectusPermission extends { id: number | string }
    ? Collections.DirectusPermission["id"][]
    : string[] | number[],
) {
  return DirectusSDK.deletePermissions<CollectionsType>(keys);
}

/**
 * Deletes a single known directus permissions item by id.
 */
export function deleteDirectusPermissionItem(
  key: Collections.DirectusPermission extends { id: number | string }
    ? Collections.DirectusPermission["id"]
    : string | number,
) {
  return DirectusSDK.deletePermission<CollectionsType>(key);
}

export class DirectusPermissionItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Creates many items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<
      CollectionsType,
      Collections.DirectusPermission
    >,
  >(
    items: Partial<Collections.DirectusPermission>[],
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusPermission,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusPermissionItems(items, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPermission
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusPermission,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusPermissionItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPermission
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusPermission,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusPermissionItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update many items in the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusPermission<CollectionsType>
    >,
  >(
    keys: Collections.DirectusPermission extends { id: number | string }
      ? Collections.DirectusPermission["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusPermission>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusPermission,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusPermissionItems(keys, patch, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPermission
    >,
  >(
    keys: Collections.DirectusPermission extends { id: number | string }
      ? Collections.DirectusPermission["id"][]
      : string[] | number[],
  ): Promise<void> {
    return await this.client.request(deleteDirectusPermissionItems(keys));
  }
}

export class DirectusPermissionItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPermission
    >,
  >(
    item: Partial<Collections.DirectusPermission>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusPermission,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusPermissionItem(item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPermission
    >,
  >(
    key: Collections.DirectusPermission extends { id: number | string }
      ? Collections.DirectusPermission["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusPermission,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusPermissionItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPermission
    >,
  >(
    key: Collections.DirectusPermission extends { id: number | string }
      ? Collections.DirectusPermission["id"]
      : string | number,
    patch: Partial<Collections.DirectusPermission>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusPermission,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusPermissionItem(key, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPermission
    >,
  >(
    key: Collections.DirectusPermission extends { id: number | string }
      ? Collections.DirectusPermission["id"]
      : string | number,
  ): Promise<void> {
    return await this.client.request(deleteDirectusPermissionItem(key));
  }
}

/**
 * Create many directus policies items.
 */
export function createDirectusPolicyItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPolicy
  >,
>(items: Partial<Collections.DirectusPolicy>[], query?: Query) {
  return DirectusSDK.createPolicies<CollectionsType, Query>(items, query);
}

/**
 * Create a single directus policies item.
 */
export function createDirectusPolicyItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Directus.DirectusPolicy<CollectionsType>
  >, // Is this a mistake? Why []?
>(item: Partial<Collections.DirectusPolicy>, query?: Query) {
  return DirectusSDK.createPolicy<CollectionsType, Query>(item, query);
}

/**
 * Read many directus policies items.
 */
export function readDirectusPolicyItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPolicy
  >,
>(query?: Query) {
  return DirectusSDK.readPolicies<CollectionsType, Query>(query);
}

/**
 * Read many directus policies items.
 */
export const listDirectusPolicy = readDirectusPolicyItems;

/**
 * Gets a single known directus policies item by id.
 */
export function readDirectusPolicyItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPolicy
  >,
>(
  key: Collections.DirectusPolicy extends { id: number | string }
    ? Collections.DirectusPolicy["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readPolicy<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus policies item by id.
 */
export const readDirectusPolicy = readDirectusPolicyItem;

/**
 * Read many directus policies items.
 */
export function updateDirectusPolicyItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPolicy
  >,
>(
  keys: Collections.DirectusPolicy extends { id: number | string }
    ? Collections.DirectusPolicy["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusPolicy>,
  query?: Query,
) {
  return DirectusSDK.updatePolicies<CollectionsType, Query>(keys, patch, query);
}

/**
 * Gets a single known directus policies item by id.
 */
export function updateDirectusPolicyItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPolicy
  >,
>(
  key: Collections.DirectusPolicy extends { id: number | string }
    ? Collections.DirectusPolicy["id"]
    : string | number,
  patch: Partial<Collections.DirectusPolicy>,
  query?: Query,
) {
  return DirectusSDK.updatePolicy<CollectionsType, Query>(key, patch, query);
}

/**
 * Deletes many directus policies items.
 */
export function deleteDirectusPolicyItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPolicy
  >,
>(
  keys: Collections.DirectusPolicy extends { id: number | string }
    ? Collections.DirectusPolicy["id"][]
    : string[] | number[],
) {
  return DirectusSDK.deletePolicies<CollectionsType>(keys);
}

/**
 * Deletes a single known directus policies item by id.
 */
export function deleteDirectusPolicyItem(
  key: Collections.DirectusPolicy extends { id: number | string }
    ? Collections.DirectusPolicy["id"]
    : string | number,
) {
  return DirectusSDK.deletePolicy<CollectionsType>(key);
}

export class DirectusPolicyItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Creates many items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<
      CollectionsType,
      Collections.DirectusPolicy
    >,
  >(
    items: Partial<Collections.DirectusPolicy>[],
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusPolicy,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusPolicyItems(items, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPolicy
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusPolicy,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusPolicyItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPolicy
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusPolicy,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusPolicyItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update many items in the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusPolicy<CollectionsType>
    >,
  >(
    keys: Collections.DirectusPolicy extends { id: number | string }
      ? Collections.DirectusPolicy["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusPolicy>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusPolicy,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusPolicyItems(keys, patch, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPolicy
    >,
  >(
    keys: Collections.DirectusPolicy extends { id: number | string }
      ? Collections.DirectusPolicy["id"][]
      : string[] | number[],
  ): Promise<void> {
    return await this.client.request(deleteDirectusPolicyItems(keys));
  }
}

export class DirectusPolicyItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPolicy
    >,
  >(
    item: Partial<Collections.DirectusPolicy>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusPolicy,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusPolicyItem(item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPolicy
    >,
  >(
    key: Collections.DirectusPolicy extends { id: number | string }
      ? Collections.DirectusPolicy["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusPolicy,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusPolicyItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPolicy
    >,
  >(
    key: Collections.DirectusPolicy extends { id: number | string }
      ? Collections.DirectusPolicy["id"]
      : string | number,
    patch: Partial<Collections.DirectusPolicy>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusPolicy,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusPolicyItem(key, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPolicy
    >,
  >(
    key: Collections.DirectusPolicy extends { id: number | string }
      ? Collections.DirectusPolicy["id"]
      : string | number,
  ): Promise<void> {
    return this.client
      .request(deleteDirectusPolicyItem(key))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }
}

/**
 * Create many directus presets items.
 */
export function createDirectusPresetItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPreset
  >,
>(items: Partial<Collections.DirectusPreset>[], query?: Query) {
  return DirectusSDK.createPresets<CollectionsType, Query>(items, query);
}

/**
 * Create a single directus presets item.
 */
export function createDirectusPresetItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Directus.DirectusPreset<CollectionsType>
  >, // Is this a mistake? Why []?
>(item: Partial<Collections.DirectusPreset>, query?: Query) {
  return DirectusSDK.createPreset<CollectionsType, Query>(item, query);
}

/**
 * Read many directus presets items.
 */
export function readDirectusPresetItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPreset
  >,
>(query?: Query) {
  return DirectusSDK.readPresets<CollectionsType, Query>(query);
}

/**
 * Read many directus presets items.
 */
export const listDirectusPreset = readDirectusPresetItems;

/**
 * Gets a single known directus presets item by id.
 */
export function readDirectusPresetItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPreset
  >,
>(
  key: Collections.DirectusPreset extends { id: number | string }
    ? Collections.DirectusPreset["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readPreset<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus presets item by id.
 */
export const readDirectusPreset = readDirectusPresetItem;

/**
 * Read many directus presets items.
 */
export function updateDirectusPresetItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPreset
  >,
>(
  keys: Collections.DirectusPreset extends { id: number | string }
    ? Collections.DirectusPreset["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusPreset>,
  query?: Query,
) {
  return DirectusSDK.updatePresets<CollectionsType, Query>(keys, patch, query);
}

/**
 * Gets a single known directus presets item by id.
 */
export function updateDirectusPresetItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPreset
  >,
>(
  key: Collections.DirectusPreset extends { id: number | string }
    ? Collections.DirectusPreset["id"]
    : string | number,
  patch: Partial<Collections.DirectusPreset>,
  query?: Query,
) {
  return DirectusSDK.updatePreset<CollectionsType, Query>(key, patch, query);
}

/**
 * Deletes many directus presets items.
 */
export function deleteDirectusPresetItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPreset
  >,
>(
  keys: Collections.DirectusPreset extends { id: number | string }
    ? Collections.DirectusPreset["id"][]
    : string[] | number[],
) {
  return DirectusSDK.deletePresets<CollectionsType>(keys);
}

/**
 * Deletes a single known directus presets item by id.
 */
export function deleteDirectusPresetItem(
  key: Collections.DirectusPreset extends { id: number | string }
    ? Collections.DirectusPreset["id"]
    : string | number,
) {
  return DirectusSDK.deletePreset<CollectionsType>(key);
}

export class DirectusPresetItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Creates many items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<
      CollectionsType,
      Collections.DirectusPreset
    >,
  >(
    items: Partial<Collections.DirectusPreset>[],
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusPreset,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusPresetItems(items, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPreset
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusPreset,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusPresetItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPreset
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusPreset,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusPresetItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update many items in the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusPreset<CollectionsType>
    >,
  >(
    keys: Collections.DirectusPreset extends { id: number | string }
      ? Collections.DirectusPreset["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusPreset>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusPreset,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusPresetItems(keys, patch, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPreset
    >,
  >(
    keys: Collections.DirectusPreset extends { id: number | string }
      ? Collections.DirectusPreset["id"][]
      : string[] | number[],
  ): Promise<void> {
    return this.client
      .request(deleteDirectusPresetItems(keys))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }
}

export class DirectusPresetItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPreset
    >,
  >(
    item: Partial<Collections.DirectusPreset>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusPreset,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusPresetItem(item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPreset
    >,
  >(
    key: Collections.DirectusPreset extends { id: number | string }
      ? Collections.DirectusPreset["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusPreset,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusPresetItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPreset
    >,
  >(
    key: Collections.DirectusPreset extends { id: number | string }
      ? Collections.DirectusPreset["id"]
      : string | number,
    patch: Partial<Collections.DirectusPreset>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusPreset,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusPresetItem(key, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPreset
    >,
  >(
    key: Collections.DirectusPreset extends { id: number | string }
      ? Collections.DirectusPreset["id"]
      : string | number,
  ): Promise<void> {
    return this.client
      .request(deleteDirectusPresetItem(key))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }
}

/**
 * Create a single directus relations item.
 */
export function createDirectusRelationItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Collections.DirectusRelation[]
  >, // Is this a mistake? Why []?
>(item: Partial<Collections.DirectusRelation>, query?: Query) {
  return DirectusSDK.createRelation<CollectionsType>(item);
}

/**
 * Read many directus relations items.
 */
export function readDirectusRelationItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusRelation
  >,
>(query?: Query) {
  return DirectusSDK.readRelations<CollectionsType>();
}

/**
 * Read many directus relations items.
 */
export const listDirectusRelation = readDirectusRelationItems;

/**
 * Gets a single known directus relations item by id.
 */
export function readDirectusRelationItem<
  const Query extends Directus.Query<
    CollectionsType,
    Directus.DirectusRelation<CollectionsType>
  >,
>(
  key: Collections.DirectusRelation extends { collection: number | string }
    ? Collections.DirectusRelation["collection"]
    : string | number,
  field: Directus.DirectusRelation<CollectionsType>["field"],
) {
  return DirectusSDK.readRelation<CollectionsType, Query>(key, field);
}

/**
 * Gets a single known directus relations item by id.
 */
export const readDirectusRelation = readDirectusRelationItem;

/**
 * Gets a single known directus relations item by id.
 */
export function updateDirectusRelationItem<
  const Query extends Directus.Query<
    CollectionsType,
    Directus.DirectusRelation<CollectionsType>
  >,
>(
  collection: Directus.DirectusRelation<CollectionsType>["collection"],
  field: Directus.DirectusRelation<CollectionsType>["field"],
  patch: Partial<Collections.DirectusRelation>,
  query?: Query,
) {
  return DirectusSDK.updateRelation<CollectionsType, Query>(
    collection,
    field,
    patch,
    query,
  );
}

/**
 * Deletes a single known directus relations item by id.
 */
export function deleteDirectusRelationItem(
  collection: Directus.DirectusRelation<CollectionsType>["collection"],
  field: Directus.DirectusRelation<CollectionsType>["field"],
) {
  return DirectusSDK.deleteRelation<CollectionsType>(collection, field);
}

export class DirectusRelationItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusRelation
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusRelation,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusRelationItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusRelation
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusRelation,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusRelationItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }
}

export class DirectusRelationItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusRelation
    >,
  >(
    item: Partial<Collections.DirectusRelation>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusRelation,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusRelationItem(item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusRelation<CollectionsType>
    >,
  >(
    key: Collections.DirectusRelation extends { collection: number | string }
      ? Collections.DirectusRelation["collection"]
      : string | number,
    field: Directus.DirectusRelation<CollectionsType>["field"],
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusRelation,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusRelationItem(key, field))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusRelation
    >,
  >(
    collection: Directus.DirectusRelation<CollectionsType>["collection"],
    field: Directus.DirectusRelation<CollectionsType>["field"],
    patch: Partial<Collections.DirectusRelation>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusRelation,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        updateDirectusRelationItem(collection, field, patch, query as any),
      )
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove(
    collection: Directus.DirectusRelation<CollectionsType>["collection"],
    field: Directus.DirectusRelation<CollectionsType>["field"],
  ): Promise<void> {
    return this.client
      .request(deleteDirectusRelationItem(collection, field))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }
}

/**
 * Read many directus revisions items.
 */
export function readDirectusRevisionItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusRevision
  >,
>(query?: Query) {
  return DirectusSDK.readRevisions<CollectionsType, Query>(query);
}

/**
 * Read many directus revisions items.
 */
export const listDirectusRevision = readDirectusRevisionItems;

/**
 * Gets a single known directus revisions item by id.
 */
export function readDirectusRevisionItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusRevision
  >,
>(
  key: Collections.DirectusRevision extends { id: number | string }
    ? Collections.DirectusRevision["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readRevision<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus revisions item by id.
 */
export const readDirectusRevision = readDirectusRevisionItem;

export class DirectusRevisionItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusRevision
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusRevision,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusRevisionItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusRevision
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusRevision,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusRevisionItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }
}

export class DirectusRevisionItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusRevision
    >,
  >(
    key: Collections.DirectusRevision extends { id: number | string }
      ? Collections.DirectusRevision["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusRevision,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusRevisionItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }
}

/**
 * Create many directus roles items.
 */
export function createDirectusRoleItems<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusRole>,
>(items: Partial<Collections.DirectusRole>[], query?: Query) {
  return DirectusSDK.createRoles<CollectionsType, Query>(items, query);
}

/**
 * Create a single directus roles item.
 */
export function createDirectusRoleItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Directus.DirectusRole<CollectionsType>
  >, // Is this a mistake? Why []?
>(item: Partial<Collections.DirectusRole>, query?: Query) {
  return DirectusSDK.createRole<CollectionsType, Query>(item, query);
}

/**
 * Read many directus roles items.
 */
export function readDirectusRoleItems<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusRole>,
>(query?: Query) {
  return DirectusSDK.readRoles<CollectionsType, Query>(query);
}

/**
 * Read many directus roles items.
 */
export const listDirectusRole = readDirectusRoleItems;

/**
 * Gets a single known directus roles item by id.
 */
export function readDirectusRoleItem<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusRole>,
>(
  key: Collections.DirectusRole extends { id: number | string }
    ? Collections.DirectusRole["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readRole<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus roles item by id.
 */
export const readDirectusRole = readDirectusRoleItem;

/**
 * Read many directus roles items.
 */
export function updateDirectusRoleItems<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusRole>,
>(
  keys: Collections.DirectusRole extends { id: number | string }
    ? Collections.DirectusRole["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusRole>,
  query?: Query,
) {
  return DirectusSDK.updateRoles<CollectionsType, Query>(keys, patch, query);
}

/**
 * Gets a single known directus roles item by id.
 */
export function updateDirectusRoleItem<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusRole>,
>(
  key: Collections.DirectusRole extends { id: number | string }
    ? Collections.DirectusRole["id"]
    : string | number,
  patch: Partial<Collections.DirectusRole>,
  query?: Query,
) {
  return DirectusSDK.updateRole<CollectionsType, Query>(key, patch, query);
}

/**
 * Deletes many directus roles items.
 */
export function deleteDirectusRoleItems<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusRole>,
>(
  keys: Collections.DirectusRole extends { id: number | string }
    ? Collections.DirectusRole["id"][]
    : string[] | number[],
) {
  return DirectusSDK.deleteRoles<CollectionsType>(keys);
}

/**
 * Deletes a single known directus roles item by id.
 */
export function deleteDirectusRoleItem(
  key: Collections.DirectusRole extends { id: number | string }
    ? Collections.DirectusRole["id"]
    : string | number,
) {
  return DirectusSDK.deleteRole<CollectionsType>(key);
}

export class DirectusRoleItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Creates many items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<
      CollectionsType,
      Collections.DirectusRole
    >,
  >(
    items: Partial<Collections.DirectusRole>[],
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusRole,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusRoleItems(items, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusRole
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusRole,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusRoleItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusRole
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusRole,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusRoleItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update many items in the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusRole<CollectionsType>
    >,
  >(
    keys: Collections.DirectusRole extends { id: number | string }
      ? Collections.DirectusRole["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusRole>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusRole,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusRoleItems(keys, patch, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusRole
    >,
  >(
    keys: Collections.DirectusRole extends { id: number | string }
      ? Collections.DirectusRole["id"][]
      : string[] | number[],
  ): Promise<void> {
    return this.client
      .request(deleteDirectusRoleItems(keys))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }
}

export class DirectusRoleItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusRole
    >,
  >(
    item: Partial<Collections.DirectusRole>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusRole,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusRoleItem(item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusRole
    >,
  >(
    key: Collections.DirectusRole extends { id: number | string }
      ? Collections.DirectusRole["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusRole,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusRoleItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusRole
    >,
  >(
    key: Collections.DirectusRole extends { id: number | string }
      ? Collections.DirectusRole["id"]
      : string | number,
    patch: Partial<Collections.DirectusRole>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusRole,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusRoleItem(key, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusRole
    >,
  >(
    key: Collections.DirectusRole extends { id: number | string }
      ? Collections.DirectusRole["id"]
      : string | number,
  ): Promise<void> {
    return this.client
      .request(deleteDirectusRoleItem(key))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }
}

/**
 * Reads the directus settings singleton.
 */
export function readDirectusSettings<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusSettings
  >,
>(query?: Query) {
  return DirectusSDK.readSettings<CollectionsType, Query>(query);
}

/**
 * Reads the directus settings singleton.
 */
export const getDirectusSettings = readDirectusSettings;

/**
 * Updates the directus settings singleton.
 */
export function updateDirectusSettings<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusSettings
  >,
>(patch: Partial<Collections.DirectusSettings>, query?: Query) {
  return DirectusSDK.updateSettings<CollectionsType, Query>(patch, query);
}

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
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusSettings
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusSettings,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusSettings(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update the singleton from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusSettings
    >,
  >(
    patch: Partial<Collections.DirectusSettings>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusSettings,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusSettings(patch, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }
}

/**
 * Create many directus users items.
 */
export function createDirectusUserItems<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusUser>,
>(items: Partial<Collections.DirectusUser>[], query?: Query) {
  return DirectusSDK.createUsers<CollectionsType, Query>(items, query);
}

/**
 * Create a single directus users item.
 */
export function createDirectusUserItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Directus.DirectusUser<CollectionsType>
  >, // Is this a mistake? Why []?
>(item: Partial<Collections.DirectusUser>, query?: Query) {
  return DirectusSDK.createUser<CollectionsType, Query>(item, query);
}

/**
 * Read many directus users items.
 */
export function readDirectusUserItems<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusUser>,
>(query?: Query) {
  return DirectusSDK.readUsers<CollectionsType, Query>(query);
}

/**
 * Read many directus users items.
 */
export const listDirectusUser = readDirectusUserItems;

/**
 * Gets a single known directus users item by id.
 */
export function readDirectusUserItem<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusUser>,
>(
  key: Collections.DirectusUser extends { id: number | string }
    ? Collections.DirectusUser["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readUser<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus users item by id.
 */
export const readDirectusUser = readDirectusUserItem;

/**
 * Read many directus users items.
 */
export function updateDirectusUserItems<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusUser>,
>(
  keys: Collections.DirectusUser extends { id: number | string }
    ? Collections.DirectusUser["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusUser>,
  query?: Query,
) {
  return DirectusSDK.updateUsers<CollectionsType, Query>(keys, patch, query);
}

/**
 * Gets a single known directus users item by id.
 */
export function updateDirectusUserItem<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusUser>,
>(
  key: Collections.DirectusUser extends { id: number | string }
    ? Collections.DirectusUser["id"]
    : string | number,
  patch: Partial<Collections.DirectusUser>,
  query?: Query,
) {
  return DirectusSDK.updateUser<CollectionsType, Query>(key, patch, query);
}

/**
 * Deletes many directus users items.
 */
export function deleteDirectusUserItems<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusUser>,
>(
  keys: Collections.DirectusUser extends { id: number | string }
    ? Collections.DirectusUser["id"][]
    : string[] | number[],
) {
  return DirectusSDK.deleteUsers<CollectionsType>(keys);
}

/**
 * Deletes a single known directus users item by id.
 */
export function deleteDirectusUserItem(
  key: Collections.DirectusUser extends { id: number | string }
    ? Collections.DirectusUser["id"]
    : string | number,
) {
  return DirectusSDK.deleteUser<CollectionsType>(key);
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
   * Creates many items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<
      CollectionsType,
      Collections.DirectusUser
    >,
  >(
    items: Partial<Collections.DirectusUser>[],
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusUser,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusUserItems(items, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusUser
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusUser,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusUserItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusUser
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusUser,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusUserItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update many items in the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusUser<CollectionsType>
    >,
  >(
    keys: Collections.DirectusUser extends { id: number | string }
      ? Collections.DirectusUser["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusUser>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusUser,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusUserItems(keys, patch, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusUser
    >,
  >(
    keys: Collections.DirectusUser extends { id: number | string }
      ? Collections.DirectusUser["id"][]
      : string[] | number[],
  ): Promise<void> {
    return await this.client.request(deleteDirectusUserItems(keys));
  }
}

export class DirectusUserItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusUser
    >,
  >(
    item: Partial<Collections.DirectusUser>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusUser,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusUserItem(item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusUser
    >,
  >(
    key: Collections.DirectusUser extends { id: number | string }
      ? Collections.DirectusUser["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusUser,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusUserItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusUser
    >,
  >(
    key: Collections.DirectusUser extends { id: number | string }
      ? Collections.DirectusUser["id"]
      : string | number,
    patch: Partial<Collections.DirectusUser>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusUser,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusUserItem(key, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusUser
    >,
  >(
    key: Collections.DirectusUser extends { id: number | string }
      ? Collections.DirectusUser["id"]
      : string | number,
  ): Promise<void> {
    return await this.client.request(deleteDirectusUserItem(key));
  }
}

/**
 * Create many directus webhooks items.
 */
export function createDirectusWebhookItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusWebhook
  >,
>(items: Partial<Collections.DirectusWebhook>[], query?: Query) {
  return DirectusSDK.createWebhooks<CollectionsType, Query>(items, query);
}

/**
 * Create a single directus webhooks item.
 */
export function createDirectusWebhookItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Directus.DirectusWebhook<CollectionsType>
  >, // Is this a mistake? Why []?
>(item: Partial<Collections.DirectusWebhook>, query?: Query) {
  return DirectusSDK.createWebhook<CollectionsType, Query>(item, query);
}

/**
 * Read many directus webhooks items.
 */
export function readDirectusWebhookItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusWebhook
  >,
>(query?: Query) {
  return DirectusSDK.readWebhooks<CollectionsType, Query>(query);
}

/**
 * Read many directus webhooks items.
 */
export const listDirectusWebhook = readDirectusWebhookItems;

/**
 * Gets a single known directus webhooks item by id.
 */
export function readDirectusWebhookItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusWebhook
  >,
>(
  key: Collections.DirectusWebhook extends { id: number | string }
    ? Collections.DirectusWebhook["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readWebhook<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus webhooks item by id.
 */
export const readDirectusWebhook = readDirectusWebhookItem;

/**
 * Read many directus webhooks items.
 */
export function updateDirectusWebhookItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusWebhook
  >,
>(
  keys: Collections.DirectusWebhook extends { id: number | string }
    ? Collections.DirectusWebhook["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusWebhook>,
  query?: Query,
) {
  return DirectusSDK.updateWebhooks<CollectionsType, Query>(keys, patch, query);
}

/**
 * Gets a single known directus webhooks item by id.
 */
export function updateDirectusWebhookItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusWebhook
  >,
>(
  key: Collections.DirectusWebhook extends { id: number | string }
    ? Collections.DirectusWebhook["id"]
    : string | number,
  patch: Partial<Collections.DirectusWebhook>,
  query?: Query,
) {
  return DirectusSDK.updateWebhook<CollectionsType, Query>(key, patch, query);
}

/**
 * Deletes many directus webhooks items.
 */
export function deleteDirectusWebhookItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusWebhook
  >,
>(
  keys: Collections.DirectusWebhook extends { id: number | string }
    ? Collections.DirectusWebhook["id"][]
    : string[] | number[],
) {
  return DirectusSDK.deleteWebhooks<CollectionsType>(keys);
}

/**
 * Deletes a single known directus webhooks item by id.
 */
export function deleteDirectusWebhookItem(
  key: Collections.DirectusWebhook extends { id: number | string }
    ? Collections.DirectusWebhook["id"]
    : string | number,
) {
  return DirectusSDK.deleteWebhook<CollectionsType>(key);
}

export class DirectusWebhookItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Creates many items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<
      CollectionsType,
      Collections.DirectusWebhook
    >,
  >(
    items: Partial<Collections.DirectusWebhook>[],
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusWebhook,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusWebhookItems(items, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusWebhook
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusWebhook,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusWebhookItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusWebhook
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusWebhook,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusWebhookItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update many items in the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusWebhook<CollectionsType>
    >,
  >(
    keys: Collections.DirectusWebhook extends { id: number | string }
      ? Collections.DirectusWebhook["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusWebhook>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusWebhook,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusWebhookItems(keys, patch, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusWebhook
    >,
  >(
    keys: Collections.DirectusWebhook extends { id: number | string }
      ? Collections.DirectusWebhook["id"][]
      : string[] | number[],
  ): Promise<void> {
    return await this.client.request(deleteDirectusWebhookItems(keys));
  }
}

export class DirectusWebhookItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusWebhook
    >,
  >(
    item: Partial<Collections.DirectusWebhook>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusWebhook,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusWebhookItem(item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusWebhook
    >,
  >(
    key: Collections.DirectusWebhook extends { id: number | string }
      ? Collections.DirectusWebhook["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusWebhook,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusWebhookItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusWebhook
    >,
  >(
    key: Collections.DirectusWebhook extends { id: number | string }
      ? Collections.DirectusWebhook["id"]
      : string | number,
    patch: Partial<Collections.DirectusWebhook>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusWebhook,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusWebhookItem(key, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusWebhook
    >,
  >(
    key: Collections.DirectusWebhook extends { id: number | string }
      ? Collections.DirectusWebhook["id"]
      : string | number,
  ): Promise<void> {
    return await this.client.request(deleteDirectusWebhookItem(key));
  }
}

/**
 * Create many directus dashboards items.
 */
export function createDirectusDashboardItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusDashboard
  >,
>(items: Partial<Collections.DirectusDashboard>[], query?: Query) {
  return DirectusSDK.createDashboards<CollectionsType, Query>(items, query);
}

/**
 * Create a single directus dashboards item.
 */
export function createDirectusDashboardItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Directus.DirectusDashboard<CollectionsType>
  >, // Is this a mistake? Why []?
>(item: Partial<Collections.DirectusDashboard>, query?: Query) {
  return DirectusSDK.createDashboard<CollectionsType, Query>(item, query);
}

/**
 * Read many directus dashboards items.
 */
export function readDirectusDashboardItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusDashboard
  >,
>(query?: Query) {
  return DirectusSDK.readDashboards<CollectionsType, Query>(query);
}

/**
 * Read many directus dashboards items.
 */
export const listDirectusDashboard = readDirectusDashboardItems;

/**
 * Gets a single known directus dashboards item by id.
 */
export function readDirectusDashboardItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusDashboard
  >,
>(
  key: Collections.DirectusDashboard extends { id: number | string }
    ? Collections.DirectusDashboard["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readDashboard<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus dashboards item by id.
 */
export const readDirectusDashboard = readDirectusDashboardItem;

/**
 * Read many directus dashboards items.
 */
export function updateDirectusDashboardItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusDashboard
  >,
>(
  keys: Collections.DirectusDashboard extends { id: number | string }
    ? Collections.DirectusDashboard["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusDashboard>,
  query?: Query,
) {
  return DirectusSDK.updateDashboards<CollectionsType, Query>(
    keys,
    patch,
    query,
  );
}

/**
 * Gets a single known directus dashboards item by id.
 */
export function updateDirectusDashboardItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusDashboard
  >,
>(
  key: Collections.DirectusDashboard extends { id: number | string }
    ? Collections.DirectusDashboard["id"]
    : string | number,
  patch: Partial<Collections.DirectusDashboard>,
  query?: Query,
) {
  return DirectusSDK.updateDashboard<CollectionsType, Query>(key, patch, query);
}

/**
 * Deletes many directus dashboards items.
 */
export function deleteDirectusDashboardItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusDashboard
  >,
>(
  keys: Collections.DirectusDashboard extends { id: number | string }
    ? Collections.DirectusDashboard["id"][]
    : string[] | number[],
) {
  return DirectusSDK.deleteDashboards<CollectionsType>(keys);
}

/**
 * Deletes a single known directus dashboards item by id.
 */
export function deleteDirectusDashboardItem(
  key: Collections.DirectusDashboard extends { id: number | string }
    ? Collections.DirectusDashboard["id"]
    : string | number,
) {
  return DirectusSDK.deleteDashboard<CollectionsType>(key);
}

export class DirectusDashboardItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Creates many items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<
      CollectionsType,
      Collections.DirectusDashboard
    >,
  >(
    items: Partial<Collections.DirectusDashboard>[],
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusDashboard,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusDashboardItems(items, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusDashboard
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusDashboard,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusDashboardItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusDashboard
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusDashboard,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusDashboardItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update many items in the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusDashboard<CollectionsType>
    >,
  >(
    keys: Collections.DirectusDashboard extends { id: number | string }
      ? Collections.DirectusDashboard["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusDashboard>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusDashboard,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusDashboardItems(keys, patch, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusDashboard
    >,
  >(
    keys: Collections.DirectusDashboard extends { id: number | string }
      ? Collections.DirectusDashboard["id"][]
      : string[] | number[],
  ): Promise<void> {
    return await this.client.request(deleteDirectusDashboardItems(keys));
  }
}

export class DirectusDashboardItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusDashboard
    >,
  >(
    item: Partial<Collections.DirectusDashboard>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusDashboard,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusDashboardItem(item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusDashboard
    >,
  >(
    key: Collections.DirectusDashboard extends { id: number | string }
      ? Collections.DirectusDashboard["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusDashboard,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusDashboardItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusDashboard
    >,
  >(
    key: Collections.DirectusDashboard extends { id: number | string }
      ? Collections.DirectusDashboard["id"]
      : string | number,
    patch: Partial<Collections.DirectusDashboard>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusDashboard,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusDashboardItem(key, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusDashboard
    >,
  >(
    key: Collections.DirectusDashboard extends { id: number | string }
      ? Collections.DirectusDashboard["id"]
      : string | number,
  ): Promise<void> {
    return await this.client.request(deleteDirectusDashboardItem(key));
  }
}

/**
 * Create many directus panels items.
 */
export function createDirectusPanelItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPanel
  >,
>(items: Partial<Collections.DirectusPanel>[], query?: Query) {
  return DirectusSDK.createPanels<CollectionsType, Query>(items, query);
}

/**
 * Create a single directus panels item.
 */
export function createDirectusPanelItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Directus.DirectusPanel<CollectionsType>
  >, // Is this a mistake? Why []?
>(item: Partial<Collections.DirectusPanel>, query?: Query) {
  return DirectusSDK.createPanel<CollectionsType, Query>(item, query);
}

/**
 * Read many directus panels items.
 */
export function readDirectusPanelItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPanel
  >,
>(query?: Query) {
  return DirectusSDK.readPanels<CollectionsType, Query>(query);
}

/**
 * Read many directus panels items.
 */
export const listDirectusPanel = readDirectusPanelItems;

/**
 * Gets a single known directus panels item by id.
 */
export function readDirectusPanelItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPanel
  >,
>(
  key: Collections.DirectusPanel extends { id: number | string }
    ? Collections.DirectusPanel["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readPanel<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus panels item by id.
 */
export const readDirectusPanel = readDirectusPanelItem;

/**
 * Read many directus panels items.
 */
export function updateDirectusPanelItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPanel
  >,
>(
  keys: Collections.DirectusPanel extends { id: number | string }
    ? Collections.DirectusPanel["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusPanel>,
  query?: Query,
) {
  return DirectusSDK.updatePanels<CollectionsType, Query>(keys, patch, query);
}

/**
 * Gets a single known directus panels item by id.
 */
export function updateDirectusPanelItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPanel
  >,
>(
  key: Collections.DirectusPanel extends { id: number | string }
    ? Collections.DirectusPanel["id"]
    : string | number,
  patch: Partial<Collections.DirectusPanel>,
  query?: Query,
) {
  return DirectusSDK.updatePanel<CollectionsType, Query>(key, patch, query);
}

/**
 * Deletes many directus panels items.
 */
export function deleteDirectusPanelItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusPanel
  >,
>(
  keys: Collections.DirectusPanel extends { id: number | string }
    ? Collections.DirectusPanel["id"][]
    : string[] | number[],
) {
  return DirectusSDK.deletePanels<CollectionsType>(keys);
}

/**
 * Deletes a single known directus panels item by id.
 */
export function deleteDirectusPanelItem(
  key: Collections.DirectusPanel extends { id: number | string }
    ? Collections.DirectusPanel["id"]
    : string | number,
) {
  return DirectusSDK.deletePanel<CollectionsType>(key);
}

export class DirectusPanelItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Creates many items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<
      CollectionsType,
      Collections.DirectusPanel
    >,
  >(
    items: Partial<Collections.DirectusPanel>[],
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusPanel,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusPanelItems(items, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPanel
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusPanel,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusPanelItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPanel
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusPanel,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusPanelItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update many items in the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusPanel<CollectionsType>
    >,
  >(
    keys: Collections.DirectusPanel extends { id: number | string }
      ? Collections.DirectusPanel["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusPanel>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusPanel,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusPanelItems(keys, patch, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPanel
    >,
  >(
    keys: Collections.DirectusPanel extends { id: number | string }
      ? Collections.DirectusPanel["id"][]
      : string[] | number[],
  ): Promise<void> {
    return await this.client.request(deleteDirectusPanelItems(keys));
  }
}

export class DirectusPanelItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPanel
    >,
  >(
    item: Partial<Collections.DirectusPanel>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusPanel,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusPanelItem(item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPanel
    >,
  >(
    key: Collections.DirectusPanel extends { id: number | string }
      ? Collections.DirectusPanel["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusPanel,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusPanelItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPanel
    >,
  >(
    key: Collections.DirectusPanel extends { id: number | string }
      ? Collections.DirectusPanel["id"]
      : string | number,
    patch: Partial<Collections.DirectusPanel>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusPanel,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusPanelItem(key, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusPanel
    >,
  >(
    key: Collections.DirectusPanel extends { id: number | string }
      ? Collections.DirectusPanel["id"]
      : string | number,
  ): Promise<void> {
    return await this.client.request(deleteDirectusPanelItem(key));
  }
}

/**
 * Create many directus notifications items.
 */
export function createDirectusNotificationItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusNotification
  >,
>(items: Partial<Collections.DirectusNotification>[], query?: Query) {
  return DirectusSDK.createNotifications<CollectionsType, Query>(items, query);
}

/**
 * Create a single directus notifications item.
 */
export function createDirectusNotificationItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Directus.DirectusNotification<CollectionsType>
  >, // Is this a mistake? Why []?
>(item: Partial<Collections.DirectusNotification>, query?: Query) {
  return DirectusSDK.createNotification<CollectionsType, Query>(item, query);
}

/**
 * Read many directus notifications items.
 */
export function readDirectusNotificationItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusNotification
  >,
>(query?: Query) {
  return DirectusSDK.readNotifications<CollectionsType, Query>(query);
}

/**
 * Read many directus notifications items.
 */
export const listDirectusNotification = readDirectusNotificationItems;

/**
 * Gets a single known directus notifications item by id.
 */
export function readDirectusNotificationItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusNotification
  >,
>(
  key: Collections.DirectusNotification extends { id: number | string }
    ? Collections.DirectusNotification["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readNotification<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus notifications item by id.
 */
export const readDirectusNotification = readDirectusNotificationItem;

/**
 * Read many directus notifications items.
 */
export function updateDirectusNotificationItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusNotification
  >,
>(
  keys: Collections.DirectusNotification extends { id: number | string }
    ? Collections.DirectusNotification["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusNotification>,
  query?: Query,
) {
  return DirectusSDK.updateNotifications<CollectionsType, Query>(
    keys,
    patch,
    query,
  );
}

/**
 * Gets a single known directus notifications item by id.
 */
export function updateDirectusNotificationItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusNotification
  >,
>(
  key: Collections.DirectusNotification extends { id: number | string }
    ? Collections.DirectusNotification["id"]
    : string | number,
  patch: Partial<Collections.DirectusNotification>,
  query?: Query,
) {
  return DirectusSDK.updateNotification<CollectionsType, Query>(
    key,
    patch,
    query,
  );
}

/**
 * Deletes many directus notifications items.
 */
export function deleteDirectusNotificationItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusNotification
  >,
>(
  keys: Collections.DirectusNotification extends { id: number | string }
    ? Collections.DirectusNotification["id"][]
    : string[] | number[],
) {
  return DirectusSDK.deleteNotifications<CollectionsType>(keys);
}

/**
 * Deletes a single known directus notifications item by id.
 */
export function deleteDirectusNotificationItem(
  key: Collections.DirectusNotification extends { id: number | string }
    ? Collections.DirectusNotification["id"]
    : string | number,
) {
  return DirectusSDK.deleteNotification<CollectionsType>(key);
}

export class DirectusNotificationItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Creates many items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<
      CollectionsType,
      Collections.DirectusNotification
    >,
  >(
    items: Partial<Collections.DirectusNotification>[],
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusNotification,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusNotificationItems(items, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusNotification
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusNotification,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusNotificationItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusNotification
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusNotification,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusNotificationItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update many items in the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusNotification<CollectionsType>
    >,
  >(
    keys: Collections.DirectusNotification extends { id: number | string }
      ? Collections.DirectusNotification["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusNotification>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusNotification,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusNotificationItems(keys, patch, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusNotification
    >,
  >(
    keys: Collections.DirectusNotification extends { id: number | string }
      ? Collections.DirectusNotification["id"][]
      : string[] | number[],
  ): Promise<void> {
    return await this.client.request(deleteDirectusNotificationItems(keys));
  }
}

export class DirectusNotificationItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusNotification
    >,
  >(
    item: Partial<Collections.DirectusNotification>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusNotification,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusNotificationItem(item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusNotification
    >,
  >(
    key: Collections.DirectusNotification extends { id: number | string }
      ? Collections.DirectusNotification["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusNotification,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusNotificationItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusNotification
    >,
  >(
    key: Collections.DirectusNotification extends { id: number | string }
      ? Collections.DirectusNotification["id"]
      : string | number,
    patch: Partial<Collections.DirectusNotification>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusNotification,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusNotificationItem(key, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusNotification
    >,
  >(
    key: Collections.DirectusNotification extends { id: number | string }
      ? Collections.DirectusNotification["id"]
      : string | number,
  ): Promise<void> {
    return await this.client.request(deleteDirectusNotificationItem(key));
  }
}

/**
 * Create many directus shares items.
 */
export function createDirectusShareItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusShare
  >,
>(items: Partial<Collections.DirectusShare>[], query?: Query) {
  return DirectusSDK.createShares<CollectionsType, Query>(items, query);
}

/**
 * Create a single directus shares item.
 */
export function createDirectusShareItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Directus.DirectusShare<CollectionsType>
  >, // Is this a mistake? Why []?
>(item: Partial<Collections.DirectusShare>, query?: Query) {
  return DirectusSDK.createShare<CollectionsType, Query>(item, query);
}

/**
 * Read many directus shares items.
 */
export function readDirectusShareItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusShare
  >,
>(query?: Query) {
  return DirectusSDK.readShares<CollectionsType, Query>(query);
}

/**
 * Read many directus shares items.
 */
export const listDirectusShare = readDirectusShareItems;

/**
 * Gets a single known directus shares item by id.
 */
export function readDirectusShareItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusShare
  >,
>(
  key: Collections.DirectusShare extends { id: number | string }
    ? Collections.DirectusShare["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readShare<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus shares item by id.
 */
export const readDirectusShare = readDirectusShareItem;

/**
 * Read many directus shares items.
 */
export function updateDirectusShareItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusShare
  >,
>(
  keys: Collections.DirectusShare extends { id: number | string }
    ? Collections.DirectusShare["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusShare>,
  query?: Query,
) {
  return DirectusSDK.updateShares<CollectionsType, Query>(keys, patch, query);
}

/**
 * Gets a single known directus shares item by id.
 */
export function updateDirectusShareItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusShare
  >,
>(
  key: Collections.DirectusShare extends { id: number | string }
    ? Collections.DirectusShare["id"]
    : string | number,
  patch: Partial<Collections.DirectusShare>,
  query?: Query,
) {
  return DirectusSDK.updateShare<CollectionsType, Query>(key, patch, query);
}

/**
 * Deletes many directus shares items.
 */
export function deleteDirectusShareItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusShare
  >,
>(
  keys: Collections.DirectusShare extends { id: number | string }
    ? Collections.DirectusShare["id"][]
    : string[] | number[],
) {
  return DirectusSDK.deleteShares<CollectionsType>(keys);
}

/**
 * Deletes a single known directus shares item by id.
 */
export function deleteDirectusShareItem(
  key: Collections.DirectusShare extends { id: number | string }
    ? Collections.DirectusShare["id"]
    : string | number,
) {
  return DirectusSDK.deleteShare<CollectionsType>(key);
}

export class DirectusShareItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Creates many items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<
      CollectionsType,
      Collections.DirectusShare
    >,
  >(
    items: Partial<Collections.DirectusShare>[],
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusShare,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusShareItems(items, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusShare
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusShare,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusShareItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusShare
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusShare,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusShareItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update many items in the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusShare<CollectionsType>
    >,
  >(
    keys: Collections.DirectusShare extends { id: number | string }
      ? Collections.DirectusShare["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusShare>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusShare,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusShareItems(keys, patch, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusShare
    >,
  >(
    keys: Collections.DirectusShare extends { id: number | string }
      ? Collections.DirectusShare["id"][]
      : string[] | number[],
  ): Promise<void> {
    return await this.client.request(deleteDirectusShareItems(keys));
  }
}

export class DirectusShareItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusShare
    >,
  >(
    item: Partial<Collections.DirectusShare>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusShare,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusShareItem(item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusShare
    >,
  >(
    key: Collections.DirectusShare extends { id: number | string }
      ? Collections.DirectusShare["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusShare,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusShareItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusShare
    >,
  >(
    key: Collections.DirectusShare extends { id: number | string }
      ? Collections.DirectusShare["id"]
      : string | number,
    patch: Partial<Collections.DirectusShare>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusShare,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusShareItem(key, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusShare
    >,
  >(
    key: Collections.DirectusShare extends { id: number | string }
      ? Collections.DirectusShare["id"]
      : string | number,
  ): Promise<void> {
    return await this.client.request(deleteDirectusShareItem(key));
  }
}

/**
 * Create many directus flows items.
 */
export function createDirectusFlowItems<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusFlow>,
>(items: Partial<Collections.DirectusFlow>[], query?: Query) {
  return DirectusSDK.createFlows<CollectionsType, Query>(items, query);
}

/**
 * Create a single directus flows item.
 */
export function createDirectusFlowItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Directus.DirectusFlow<CollectionsType>
  >, // Is this a mistake? Why []?
>(item: Partial<Collections.DirectusFlow>, query?: Query) {
  return DirectusSDK.createFlow<CollectionsType, Query>(item, query);
}

/**
 * Read many directus flows items.
 */
export function readDirectusFlowItems<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusFlow>,
>(query?: Query) {
  return DirectusSDK.readFlows<CollectionsType, Query>(query);
}

/**
 * Read many directus flows items.
 */
export const listDirectusFlow = readDirectusFlowItems;

/**
 * Gets a single known directus flows item by id.
 */
export function readDirectusFlowItem<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusFlow>,
>(
  key: Collections.DirectusFlow extends { id: number | string }
    ? Collections.DirectusFlow["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readFlow<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus flows item by id.
 */
export const readDirectusFlow = readDirectusFlowItem;

/**
 * Read many directus flows items.
 */
export function updateDirectusFlowItems<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusFlow>,
>(
  keys: Collections.DirectusFlow extends { id: number | string }
    ? Collections.DirectusFlow["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusFlow>,
  query?: Query,
) {
  return DirectusSDK.updateFlows<CollectionsType, Query>(keys, patch, query);
}

/**
 * Gets a single known directus flows item by id.
 */
export function updateDirectusFlowItem<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusFlow>,
>(
  key: Collections.DirectusFlow extends { id: number | string }
    ? Collections.DirectusFlow["id"]
    : string | number,
  patch: Partial<Collections.DirectusFlow>,
  query?: Query,
) {
  return DirectusSDK.updateFlow<CollectionsType, Query>(key, patch, query);
}

/**
 * Deletes many directus flows items.
 */
export function deleteDirectusFlowItems<
  const Query extends Directus.Query<CollectionsType, Collections.DirectusFlow>,
>(
  keys: Collections.DirectusFlow extends { id: number | string }
    ? Collections.DirectusFlow["id"][]
    : string[] | number[],
) {
  return DirectusSDK.deleteFlows<CollectionsType>(keys);
}

/**
 * Deletes a single known directus flows item by id.
 */
export function deleteDirectusFlowItem(
  key: Collections.DirectusFlow extends { id: number | string }
    ? Collections.DirectusFlow["id"]
    : string | number,
) {
  return DirectusSDK.deleteFlow<CollectionsType>(key);
}

export class DirectusFlowItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Creates many items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<
      CollectionsType,
      Collections.DirectusFlow
    >,
  >(
    items: Partial<Collections.DirectusFlow>[],
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusFlow,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusFlowItems(items, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFlow
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusFlow,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusFlowItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFlow
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusFlow,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusFlowItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update many items in the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusFlow<CollectionsType>
    >,
  >(
    keys: Collections.DirectusFlow extends { id: number | string }
      ? Collections.DirectusFlow["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusFlow>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusFlow,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusFlowItems(keys, patch, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFlow
    >,
  >(
    keys: Collections.DirectusFlow extends { id: number | string }
      ? Collections.DirectusFlow["id"][]
      : string[] | number[],
  ): Promise<void> {
    return await this.client.request(deleteDirectusFlowItems(keys));
  }
}

export class DirectusFlowItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFlow
    >,
  >(
    item: Partial<Collections.DirectusFlow>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusFlow,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusFlowItem(item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFlow
    >,
  >(
    key: Collections.DirectusFlow extends { id: number | string }
      ? Collections.DirectusFlow["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusFlow,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusFlowItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFlow
    >,
  >(
    key: Collections.DirectusFlow extends { id: number | string }
      ? Collections.DirectusFlow["id"]
      : string | number,
    patch: Partial<Collections.DirectusFlow>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusFlow,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusFlowItem(key, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusFlow
    >,
  >(
    key: Collections.DirectusFlow extends { id: number | string }
      ? Collections.DirectusFlow["id"]
      : string | number,
  ): Promise<void> {
    return await this.client.request(deleteDirectusFlowItem(key));
  }
}

/**
 * Create many directus operations items.
 */
export function createDirectusOperationItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusOperation
  >,
>(items: Partial<Collections.DirectusOperation>[], query?: Query) {
  return DirectusSDK.createOperations<CollectionsType, Query>(items, query);
}

/**
 * Create a single directus operations item.
 */
export function createDirectusOperationItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Directus.DirectusOperation<CollectionsType>
  >, // Is this a mistake? Why []?
>(item: Partial<Collections.DirectusOperation>, query?: Query) {
  return DirectusSDK.createOperation<CollectionsType, Query>(item, query);
}

/**
 * Read many directus operations items.
 */
export function readDirectusOperationItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusOperation
  >,
>(query?: Query) {
  return DirectusSDK.readOperations<CollectionsType, Query>(query);
}

/**
 * Read many directus operations items.
 */
export const listDirectusOperation = readDirectusOperationItems;

/**
 * Gets a single known directus operations item by id.
 */
export function readDirectusOperationItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusOperation
  >,
>(
  key: Collections.DirectusOperation extends { id: number | string }
    ? Collections.DirectusOperation["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readOperation<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus operations item by id.
 */
export const readDirectusOperation = readDirectusOperationItem;

/**
 * Read many directus operations items.
 */
export function updateDirectusOperationItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusOperation
  >,
>(
  keys: Collections.DirectusOperation extends { id: number | string }
    ? Collections.DirectusOperation["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusOperation>,
  query?: Query,
) {
  return DirectusSDK.updateOperations<CollectionsType, Query>(
    keys,
    patch,
    query,
  );
}

/**
 * Gets a single known directus operations item by id.
 */
export function updateDirectusOperationItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusOperation
  >,
>(
  key: Collections.DirectusOperation extends { id: number | string }
    ? Collections.DirectusOperation["id"]
    : string | number,
  patch: Partial<Collections.DirectusOperation>,
  query?: Query,
) {
  return DirectusSDK.updateOperation<CollectionsType, Query>(key, patch, query);
}

/**
 * Deletes many directus operations items.
 */
export function deleteDirectusOperationItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusOperation
  >,
>(
  keys: Collections.DirectusOperation extends { id: number | string }
    ? Collections.DirectusOperation["id"][]
    : string[] | number[],
) {
  return DirectusSDK.deleteOperations<CollectionsType>(keys);
}

/**
 * Deletes a single known directus operations item by id.
 */
export function deleteDirectusOperationItem(
  key: Collections.DirectusOperation extends { id: number | string }
    ? Collections.DirectusOperation["id"]
    : string | number,
) {
  return DirectusSDK.deleteOperation<CollectionsType>(key);
}

export class DirectusOperationItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Creates many items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<
      CollectionsType,
      Collections.DirectusOperation
    >,
  >(
    items: Partial<Collections.DirectusOperation>[],
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusOperation,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusOperationItems(items, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusOperation
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusOperation,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusOperationItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusOperation
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusOperation,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusOperationItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update many items in the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusOperation<CollectionsType>
    >,
  >(
    keys: Collections.DirectusOperation extends { id: number | string }
      ? Collections.DirectusOperation["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusOperation>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusOperation,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusOperationItems(keys, patch, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusOperation
    >,
  >(
    keys: Collections.DirectusOperation extends { id: number | string }
      ? Collections.DirectusOperation["id"][]
      : string[] | number[],
  ): Promise<void> {
    return await this.client.request(deleteDirectusOperationItems(keys));
  }
}

export class DirectusOperationItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusOperation
    >,
  >(
    item: Partial<Collections.DirectusOperation>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusOperation,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusOperationItem(item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusOperation
    >,
  >(
    key: Collections.DirectusOperation extends { id: number | string }
      ? Collections.DirectusOperation["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusOperation,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusOperationItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusOperation
    >,
  >(
    key: Collections.DirectusOperation extends { id: number | string }
      ? Collections.DirectusOperation["id"]
      : string | number,
    patch: Partial<Collections.DirectusOperation>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusOperation,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusOperationItem(key, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusOperation
    >,
  >(
    key: Collections.DirectusOperation extends { id: number | string }
      ? Collections.DirectusOperation["id"]
      : string | number,
  ): Promise<void> {
    return await this.client.request(deleteDirectusOperationItem(key));
  }
}

/**
 * Create many directus translations items.
 */
export function createDirectusTranslationItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusTranslation
  >,
>(items: Partial<Collections.DirectusTranslation>[], query?: Query) {
  return DirectusSDK.createTranslations<CollectionsType, Query>(items, query);
}

/**
 * Create a single directus translations item.
 */
export function createDirectusTranslationItem<
  const Query extends DirectusSDK.Query<
    CollectionsType,
    Directus.DirectusTranslation<CollectionsType>
  >, // Is this a mistake? Why []?
>(item: Partial<Collections.DirectusTranslation>, query?: Query) {
  return DirectusSDK.createTranslation<CollectionsType, Query>(item, query);
}

/**
 * Read many directus translations items.
 */
export function readDirectusTranslationItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusTranslation
  >,
>(query?: Query) {
  return DirectusSDK.readTranslations<CollectionsType, Query>(query);
}

/**
 * Read many directus translations items.
 */
export const listDirectusTranslation = readDirectusTranslationItems;

/**
 * Gets a single known directus translations item by id.
 */
export function readDirectusTranslationItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusTranslation
  >,
>(
  key: Collections.DirectusTranslation extends { id: number | string }
    ? Collections.DirectusTranslation["id"]
    : string | number,
  query?: Query,
) {
  return DirectusSDK.readTranslation<CollectionsType, Query>(key, query);
}

/**
 * Gets a single known directus translations item by id.
 */
export const readDirectusTranslation = readDirectusTranslationItem;

/**
 * Read many directus translations items.
 */
export function updateDirectusTranslationItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusTranslation
  >,
>(
  keys: Collections.DirectusTranslation extends { id: number | string }
    ? Collections.DirectusTranslation["id"][]
    : string[] | number[],
  patch: Partial<Collections.DirectusTranslation>,
  query?: Query,
) {
  return DirectusSDK.updateTranslations<CollectionsType, Query>(
    keys,
    patch,
    query,
  );
}

/**
 * Gets a single known directus translations item by id.
 */
export function updateDirectusTranslationItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusTranslation
  >,
>(
  key: Collections.DirectusTranslation extends { id: number | string }
    ? Collections.DirectusTranslation["id"]
    : string | number,
  patch: Partial<Collections.DirectusTranslation>,
  query?: Query,
) {
  return DirectusSDK.updateTranslation<CollectionsType, Query>(
    key,
    patch,
    query,
  );
}

/**
 * Deletes many directus translations items.
 */
export function deleteDirectusTranslationItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusTranslation
  >,
>(
  keys: Collections.DirectusTranslation extends { id: number | string }
    ? Collections.DirectusTranslation["id"][]
    : string[] | number[],
) {
  return DirectusSDK.deleteTranslations<CollectionsType>(keys);
}

/**
 * Deletes a single known directus translations item by id.
 */
export function deleteDirectusTranslationItem(
  key: Collections.DirectusTranslation extends { id: number | string }
    ? Collections.DirectusTranslation["id"]
    : string | number,
) {
  return DirectusSDK.deleteTranslation<CollectionsType>(key);
}

export class DirectusTranslationItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Creates many items in the collection.
   */
  async create<
    const Query extends DirectusSDK.Query<
      CollectionsType,
      Collections.DirectusTranslation
    >,
  >(
    items: Partial<Collections.DirectusTranslation>[],
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusTranslation,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusTranslationItems(items, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusTranslation
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusTranslation,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusTranslationItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusTranslation
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusTranslation,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusTranslationItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update many items in the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Directus.DirectusTranslation<CollectionsType>
    >,
  >(
    keys: Collections.DirectusTranslation extends { id: number | string }
      ? Collections.DirectusTranslation["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusTranslation>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusTranslation,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusTranslationItems(keys, patch, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusTranslation
    >,
  >(
    keys: Collections.DirectusTranslation extends { id: number | string }
      ? Collections.DirectusTranslation["id"][]
      : string[] | number[],
  ): Promise<void> {
    return await this.client.request(deleteDirectusTranslationItems(keys));
  }
}

export class DirectusTranslationItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Create a single item in the collection.
   */
  async create<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusTranslation
    >,
  >(
    item: Partial<Collections.DirectusTranslation>,
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusTranslation,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(createDirectusTranslationItem(item, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusTranslation
    >,
  >(
    key: Collections.DirectusTranslation extends { id: number | string }
      ? Collections.DirectusTranslation["id"]
      : string | number,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusTranslation,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusTranslationItem(key, query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusTranslation
    >,
  >(
    key: Collections.DirectusTranslation extends { id: number | string }
      ? Collections.DirectusTranslation["id"]
      : string | number,
    patch: Partial<Collections.DirectusTranslation>,
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusTranslation,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusTranslationItem(key, patch, query as any))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }

  /**
   * Remove many items in the collection.
   */
  async remove<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusTranslation
    >,
  >(
    key: Collections.DirectusTranslation extends { id: number | string }
      ? Collections.DirectusTranslation["id"]
      : string | number,
  ): Promise<void> {
    return await this.client.request(deleteDirectusTranslationItem(key));
  }
}

/**
 * Read many directus extensions items.
 */
export function readDirectusExtensionItems<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusExtension
  >,
>(query?: Query) {
  return DirectusSDK.readExtensions<CollectionsType>();
}

/**
 * Read many directus extensions items.
 */
export const listDirectusExtension = readDirectusExtensionItems;

/**
 * Gets a single known directus extensions item by id.
 */
export function updateDirectusExtensionItem<
  const Query extends Directus.Query<
    CollectionsType,
    Collections.DirectusExtension
  >,
>(
  bundle: string | null,
  name: string,
  data: Directus.NestedPartial<Directus.DirectusExtension<CollectionsType>>,
) {
  return DirectusSDK.updateExtension<CollectionsType>(bundle, name, data);
}

export class DirectusExtensionItems {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Read many items from the collection.
   */
  async query<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusExtension
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusExtension,
          Query extends undefined
            ? ["*"]
            : Query["fields"] extends undefined
              ? ["*"]
              : Query["fields"] extends Readonly<any[]>
                ? Query["fields"]
                : ["*"]
        >[];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(readDirectusExtensionItems(query))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true })); // the any type is here because we transform the type through or custom ApplyQueryFields type.
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusExtension
    >,
  >(
    query?: Query,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusExtension,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(
        readDirectusExtensionItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => ({ data: items?.[0], isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }
}

export class DirectusExtensionItem {
  /**
   *
   */
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<
      CollectionsType,
      Collections.DirectusExtension
    >,
  >(
    bundle: string | null,
    name: string,
    data: Directus.NestedPartial<Directus.DirectusExtension<CollectionsType>>,
  ): Promise<
    | {
        data:
          | ApplyQueryFields<
              CollectionsType,
              Collections.DirectusExtension,
              Query extends undefined
                ? ["*"]
                : Query["fields"] extends undefined
                  ? ["*"]
                  : Query["fields"] extends Readonly<any[]>
                    ? Query["fields"]
                    : ["*"]
            >
          | undefined;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return this.client
      .request(updateDirectusExtensionItem(bundle, name, data))
      .then((data) => ({ data, isError: false }) as any)
      .catch((error) => ({ error, isError: true }));
  }
}

export class Requests {
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}
  public acceptUserInvite(
    ...params: Parameters<typeof DirectusSDK.acceptUserInvite>
  ) {
    return toSafe(this.client.request(DirectusSDK.acceptUserInvite(...params)));
  }
  public aggregate<
    Collection extends DirectusSDK.AllCollections<CollectionsType>,
    Options extends Directus.AggregationOptions<CollectionsType, Collection>,
  >(
    collection: Collection,
    options: Options,
  ): Promise<
    | {
        data: DirectusSDK.AggregationOutput<
          CollectionsType,
          Collection,
          Options
        >[number];
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return toSafe(
      this.client
        .request(DirectusSDK.aggregate(collection, options as any))
        .then((res) => res[0]),
    ) as any;
  }
  public authenticateShare(
    ...params: Parameters<typeof DirectusSDK.authenticateShare>
  ) {
    return toSafe(
      this.client.request(DirectusSDK.authenticateShare(...params)),
    );
  }
  public clearCache(...params: Parameters<typeof DirectusSDK.clearCache>) {
    return toSafe(this.client.request(DirectusSDK.clearCache(...params)));
  }
  public compareContentVersion(
    ...params: Parameters<typeof DirectusSDK.compareContentVersion>
  ) {
    return toSafe(
      this.client.request(DirectusSDK.compareContentVersion(...params)),
    );
  }
  public customEndpoint(
    ...params: Parameters<typeof DirectusSDK.customEndpoint>
  ) {
    return toSafe(this.client.request(DirectusSDK.customEndpoint(...params)));
  }
  public disableTwoFactor(
    ...params: Parameters<typeof DirectusSDK.disableTwoFactor>
  ) {
    return toSafe(this.client.request(DirectusSDK.disableTwoFactor(...params)));
  }
  public enableTwoFactor(
    ...params: Parameters<typeof DirectusSDK.enableTwoFactor>
  ) {
    return toSafe(this.client.request(DirectusSDK.enableTwoFactor(...params)));
  }
  public generateHash(...params: Parameters<typeof DirectusSDK.generateHash>) {
    return toSafe(this.client.request(DirectusSDK.generateHash(...params)));
  }
  public generateTwoFactorSecret(
    ...params: Parameters<typeof DirectusSDK.generateTwoFactorSecret>
  ) {
    return toSafe(
      this.client.request(DirectusSDK.generateTwoFactorSecret(...params)),
    );
  }
  public importFile<
    Schema,
    TQuery extends Directus.Query<CollectionsType, Collections.DirectusFile>,
  >(
    url: string,
    data?: Partial<Collections.DirectusFile>,
    query?: TQuery,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusFile,
          TQuery extends undefined
            ? ["*"]
            : TQuery["fields"] extends undefined
              ? ["*"]
              : TQuery["fields"] extends Readonly<any[]>
                ? TQuery["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return toSafe(
      this.client.request(
        DirectusSDK.importFile<CollectionsType, TQuery>(url, data, query),
      ),
    ) as any;
  }
  public inviteShare(...params: Parameters<typeof DirectusSDK.inviteShare>) {
    return toSafe(this.client.request(DirectusSDK.inviteShare(...params)));
  }
  public inviteUser(...params: Parameters<typeof DirectusSDK.inviteUser>) {
    return toSafe(this.client.request(DirectusSDK.inviteUser(...params)));
  }
  public login(...params: Parameters<typeof DirectusSDK.login>) {
    return toSafe(this.client.request(DirectusSDK.login(...params)));
  }
  public logout(...params: Parameters<typeof DirectusSDK.logout>) {
    return toSafe(this.client.request(DirectusSDK.logout(...params)));
  }
  public passwordRequest(
    ...params: Parameters<typeof DirectusSDK.passwordRequest>
  ) {
    return toSafe(this.client.request(DirectusSDK.passwordRequest(...params)));
  }
  public passwordReset(
    ...params: Parameters<typeof DirectusSDK.passwordReset>
  ) {
    return toSafe(this.client.request(DirectusSDK.passwordReset(...params)));
  }
  public promoteContentVersion<Collection extends keyof CollectionsType>(
    ...params: Parameters<
      typeof DirectusSDK.promoteContentVersion<CollectionsType, Collection>
    >
  ) {
    return toSafe(
      this.client.request(DirectusSDK.promoteContentVersion(...params)),
    );
  }
  public randomString(...params: Parameters<typeof DirectusSDK.randomString>) {
    return toSafe(this.client.request(DirectusSDK.randomString(...params)));
  }
  public refresh(...params: Parameters<typeof DirectusSDK.refresh>) {
    return toSafe(this.client.request(DirectusSDK.refresh(...params)));
  }
  public registerUser(...params: Parameters<typeof DirectusSDK.registerUser>) {
    return toSafe(this.client.request(DirectusSDK.registerUser(...params)));
  }
  public registerUserVerify(
    ...params: Parameters<typeof DirectusSDK.registerUserVerify>
  ) {
    return toSafe(
      this.client.request(DirectusSDK.registerUserVerify(...params)),
    );
  }
  public saveToContentVersion(
    ...params: Parameters<typeof DirectusSDK.saveToContentVersion>
  ) {
    return toSafe(
      this.client.request(DirectusSDK.saveToContentVersion(...params)),
    );
  }
  public schemaApply(...params: Parameters<typeof DirectusSDK.schemaApply>) {
    return toSafe(this.client.request(DirectusSDK.schemaApply(...params)));
  }
  public schemaDiff(...params: Parameters<typeof DirectusSDK.schemaDiff>) {
    return toSafe(this.client.request(DirectusSDK.schemaDiff(...params)));
  }
  public schemaSnapshot(
    ...params: Parameters<typeof DirectusSDK.schemaSnapshot>
  ) {
    return toSafe(this.client.request(DirectusSDK.schemaSnapshot(...params)));
  }
  public serverHealth(...params: Parameters<typeof DirectusSDK.serverHealth>) {
    return toSafe(this.client.request(DirectusSDK.serverHealth(...params)));
  }
  public serverInfo(...params: Parameters<typeof DirectusSDK.serverInfo>) {
    return toSafe(this.client.request(DirectusSDK.serverInfo(...params)));
  }
  public serverPing(...params: Parameters<typeof DirectusSDK.serverPing>) {
    return toSafe(this.client.request(DirectusSDK.serverPing(...params)));
  }
  public triggerFlow(...params: Parameters<typeof DirectusSDK.triggerFlow>) {
    return toSafe(this.client.request(DirectusSDK.triggerFlow(...params)));
  }
  public triggerOperation(
    ...params: Parameters<typeof DirectusSDK.triggerOperation>
  ) {
    return toSafe(this.client.request(DirectusSDK.triggerOperation(...params)));
  }
  public uploadFiles<
    const TQuery extends Directus.Query<
      CollectionsType,
      Collections.DirectusFile
    >,
  >(
    data: FormData,
    query?: TQuery,
  ): Promise<
    | {
        data: ApplyQueryFields<
          CollectionsType,
          Collections.DirectusFile,
          TQuery extends undefined
            ? ["*"]
            : TQuery["fields"] extends undefined
              ? ["*"]
              : TQuery["fields"] extends Readonly<any[]>
                ? TQuery["fields"]
                : ["*"]
        >;
        isError: false;
        error: never;
      }
    | { error: Error; isError: true; data: never }
  > {
    return toSafe(
      this.client.request(
        DirectusSDK.uploadFiles<CollectionsType, TQuery>(data, query),
      ),
    ) as any;
  }
  public async utilitySort(
    ...params: Parameters<typeof DirectusSDK.utilitySort>
  ) {
    return toSafe(this.client.request(DirectusSDK.utilitySort(...params)));
  }
  public utilsExport<
    TQuery extends Directus.Query<Schema, Schema[Collection]>,
    Collection extends keyof Schema,
  >(
    collection: Collection,
    format: Directus.FileFormat,
    query: TQuery,
    file: Partial<Directus.DirectusFile<CollectionsType>>,
  ) {
    return toSafe(
      this.client.request(
        DirectusSDK.utilsExport(collection, format, query, file),
      ),
    );
  }
  public utilsImport(...params: Parameters<typeof DirectusSDK.utilsImport>) {
    return toSafe(this.client.request(DirectusSDK.utilsImport(...params)));
  }
  public verifyHash(...params: Parameters<typeof DirectusSDK.verifyHash>) {
    return toSafe(this.client.request(DirectusSDK.verifyHash(...params)));
  }
  public withOptions(...params: Parameters<typeof DirectusSDK.withOptions>) {
    return toSafe(this.client.request(DirectusSDK.withOptions(...params)));
  }
  public withSearch(...params: Parameters<typeof DirectusSDK.withSearch>) {
    return toSafe(this.client.request(DirectusSDK.withSearch(...params)));
  }
  public withToken(...params: Parameters<typeof DirectusSDK.withToken>) {
    return toSafe(this.client.request(DirectusSDK.withToken(...params)));
  }
}
