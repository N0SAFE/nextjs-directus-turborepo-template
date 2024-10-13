import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import {
  Collections,
  CollectionsType,
  DirectusCommands,
  Schema,
} from "../../client";

import { toSafe } from "../../utils";

type DirectusSDK = typeof DirectusSDK;

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
