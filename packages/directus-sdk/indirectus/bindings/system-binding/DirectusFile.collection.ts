import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import type { ApplyQueryFields } from "../../types/ApplyQueryFields";

import type { Collections, Schema } from "../../client";
import {
  aggregateDirectusFileItems,
  deleteDirectusFileItem,
  deleteDirectusFileItems,
  readDirectusFileArrayBuffer,
  readDirectusFileBlob,
  readDirectusFileItem,
  readDirectusFileItems,
  readDirectusFileStream,
  updateBatchDirectusFileItems,
  updateDirectusFileItem,
  updateDirectusFileItems,
} from "../../commands/DirectusFile.commands";
import ChainableBinding from "../chainable-bindable";

export class DirectusFileItems extends ChainableBinding {
  async create<
    const Query extends Directus.Query<Schema, Collections.DirectusFile>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFile,
      Query["fields"]
    >[],
  >(
    items: (Partial<Collections.DirectusFile> & { file: File })[],
    query?: Query,
  ): Promise<Output> {
    const arraySymbol = Symbol("array");

    const formData = new FormData();
    const pathToFormDataPath = (path: (string | typeof arraySymbol)[]) => {
      const result: string[] = [];
      const first = path.shift();
      for (const part of path) {
        if (part === arraySymbol) {
          result.push("[]");
        } else {
          result.push(`[${part}]`);
        }
      }
      if (first === arraySymbol) {
        return result.join("");
      }
      return first + result.join("");
    };
    const populateFormData = (
      item: object,
      path: (string | typeof arraySymbol)[] = [],
    ) => {
      for (const [key, value] of Object.entries(item)) {
        if (value instanceof File) {
          formData.append(pathToFormDataPath([...path, key]), value);
        } else if (Array.isArray(value)) {
          for (const item of value) {
            if (item instanceof File) {
              formData.append(
                pathToFormDataPath([...path, key, arraySymbol]),
                item,
              );
            } else if (item instanceof Date) {
              formData.append(
                pathToFormDataPath([...path, key, arraySymbol]),
                item.toISOString(),
              );
            } else if (item instanceof Object) {
              populateFormData(item, [...path, key, arraySymbol]);
            } else {
              formData.append(
                pathToFormDataPath([...path, key, arraySymbol]),
                item,
              );
            }
          }
        } else if (value instanceof Date) {
          formData.append(
            pathToFormDataPath([...path, key]),
            value.toISOString(),
          );
        } else if (value instanceof Object) {
          populateFormData(value, [...path, key]);
        } else {
          formData.append(pathToFormDataPath([...path, key]), value);
        }
      }
      return formData;
    };

    for (const item of items) {
      populateFormData(item);
    }

    return this.request(
      DirectusSDK.uploadFiles<Schema, Query>(formData, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read munknown items from the collection.
   */
  async query<
    const Query extends Directus.Query<Schema, Collections.DirectusFile>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFile,
      Query["fields"]
    >[],
  >(query?: Query): Promise<Output> {
    return this.request(
      readDirectusFileItems(query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read the first item from the collection matching the query.
   */
  async find<
    const Query extends Directus.Query<Schema, Collections.DirectusFile>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFile,
      Query["fields"]
    >,
  >(query?: Query): Promise<Output | undefined> {
    return this.client
      .request(
        readDirectusFileItems({
          ...query,
          limit: 1,
        }),
      )
      .then((items) => items?.[0]) as unknown as Promise<Output | undefined>;
  }

  /**
   * Update munknown items in the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Directus.DirectusFile<Schema>>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFile,
      Query["fields"]
    >[],
  >(
    keys: Collections.DirectusFile extends { id: number | string }
      ? Collections.DirectusFile["id"][]
      : string[] | number[],
    patch: Partial<Collections.DirectusFile>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusFileItems(keys, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Update munknown items in the collection with batch.
   */
  async updateBatch<
    const Query extends Directus.Query<Schema, Directus.DirectusFile<Schema>>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFile,
      Query["fields"]
    >[],
  >(
    items: Directus.NestedPartial<Collections.DirectusFile>[],
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateBatchDirectusFileItems(items, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    keys: Collections.DirectusFile extends { id: number | string }
      ? Collections.DirectusFile["id"][]
      : string[] | number[],
  ): Promise<Output> {
    return this.request(
      deleteDirectusFileItems(keys),
    ) as unknown as Promise<Output>;
  }

  /**
   * Aggregates the items in the collection.
   */
  async aggregate<
    Options extends Directus.AggregationOptions<Schema, "directus_files">,
    Output = Directus.AggregationOutput<
      Schema,
      "directus_files",
      Options
    >[number],
  >(options: Options): Promise<Output> {
    return this.request(aggregateDirectusFileItems<Options>(options)).then(
      (a) => a?.[0],
    ) as unknown as Promise<Output>;
  }
}

export class DirectusFileItem extends ChainableBinding {
  async create<
    const Query extends Directus.Query<Schema, Collections.DirectusFile>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFile,
      Query["fields"]
    >,
  >(
    item: Partial<Collections.DirectusFile> & { file: File },
    query?: Query,
  ): Promise<Output> {
    const arraySymbol = Symbol("array");

    const formData = new FormData();
    const pathToFormDataPath = (path: (string | typeof arraySymbol)[]) => {
      const result: string[] = [];
      const first = path.shift();
      for (const part of path) {
        if (part === arraySymbol) {
          result.push("[]");
        } else {
          result.push(`[${part}]`);
        }
      }
      if (first === arraySymbol) {
        return result.join("");
      }
      return first + result.join("");
    };
    const populateFormData = (
      item: object,
      path: (string | typeof arraySymbol)[] = [],
    ) => {
      for (const [key, value] of Object.entries(item)) {
        if (value instanceof File) {
          formData.append(pathToFormDataPath([...path, key]), value);
        } else if (Array.isArray(value)) {
          for (const item of value) {
            if (item instanceof File) {
              formData.append(
                pathToFormDataPath([...path, key, arraySymbol]),
                item,
              );
            } else if (item instanceof Date) {
              formData.append(
                pathToFormDataPath([...path, key, arraySymbol]),
                item.toISOString(),
              );
            } else if (item instanceof Object) {
              populateFormData(item, [...path, key, arraySymbol]);
            } else {
              formData.append(
                pathToFormDataPath([...path, key, arraySymbol]),
                item,
              );
            }
          }
        } else if (value instanceof Date) {
          formData.append(
            pathToFormDataPath([...path, key]),
            value.toISOString(),
          );
        } else if (value instanceof Object) {
          populateFormData(value, [...path, key]);
        } else {
          formData.append(pathToFormDataPath([...path, key]), value);
        }
      }
      return formData;
    };

    populateFormData(item);

    return this.request(
      DirectusSDK.uploadFiles<Schema, Query>(formData, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Read a single item from the collection.
   */
  async get<
    const Query extends Directus.Query<Schema, Collections.DirectusFile>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFile,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusFile extends { id: number | string }
      ? Collections.DirectusFile["id"]
      : string | number,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      readDirectusFileItem(key, query),
    ) as unknown as Promise<Output>;
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
    return await this.request(readDirectusFileArrayBuffer(key, query));
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
    return await this.request(readDirectusFileBlob(key, query));
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
    return await this.request(readDirectusFileStream(key, query));
  }

  /**
   * Update a single item from the collection.
   */
  async update<
    const Query extends Directus.Query<Schema, Collections.DirectusFile>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFile,
      Query["fields"]
    >,
  >(
    key: Collections.DirectusFile extends { id: number | string }
      ? Collections.DirectusFile["id"]
      : string | number,
    patch: Partial<Collections.DirectusFile>,
    query?: Query,
  ): Promise<Output> {
    return this.request(
      updateDirectusFileItem(key, patch, query),
    ) as unknown as Promise<Output>;
  }

  /**
   * Remove munknown items in the collection.
   */
  async remove<Output = void>(
    key: Collections.DirectusFile extends { id: number | string }
      ? Collections.DirectusFile["id"]
      : string | number,
  ): Promise<Output> {
    return this.request(
      deleteDirectusFileItem(key),
    ) as unknown as Promise<Output>;
  }
}
