import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import {
  Collections,
  CollectionsType,
  DirectusCommands,
  Schema,
} from "../../client";

type DirectusSDK = typeof DirectusSDK;

export class Requests {
  constructor(
    private client: Directus.DirectusClient<Schema> &
      Directus.RestClient<Schema>,
  ) {}
  public acceptUserInvite(
    ...params: Parameters<typeof Directus.acceptUserInvite>
  ) {
    return this.client.request(DirectusSDK.acceptUserInvite(...params));
  }
  public aggregate<
    Collection extends DirectusSDK.AllCollections<CollectionsType>,
    Options extends Directus.AggregationOptions<CollectionsType, Collection>,
  >(
    collection: Collection,
    options: Options,
  ): Promise<
    DirectusSDK.AggregationOutput<CollectionsType, Collection, Options>[number]
  > {
    return this.client
      .request(DirectusSDK.aggregate(collection, options as any))
      .then((res) => res[0]) as any;
  }
  public authenticateShare(
    ...params: Parameters<typeof Directus.authenticateShare>
  ) {
    return this.client.request(DirectusSDK.authenticateShare(...params));
  }
  public clearCache(...params: Parameters<typeof Directus.clearCache>) {
    return this.client.request(DirectusSDK.clearCache(...params));
  }
  public compareContentVersion(
    ...params: Parameters<typeof Directus.compareContentVersion>
  ) {
    return this.client.request(DirectusSDK.compareContentVersion(...params));
  }
  public customEndpoint(...params: Parameters<typeof Directus.customEndpoint>) {
    return this.client.request(DirectusSDK.customEndpoint(...params));
  }
  public disableTwoFactor(
    ...params: Parameters<typeof Directus.disableTwoFactor>
  ) {
    return this.client.request(DirectusSDK.disableTwoFactor(...params));
  }
  public enableTwoFactor(
    ...params: Parameters<typeof Directus.enableTwoFactor>
  ) {
    return this.client.request(DirectusSDK.enableTwoFactor(...params));
  }
  public generateHash(...params: Parameters<typeof Directus.generateHash>) {
    return this.client.request(DirectusSDK.generateHash(...params));
  }
  public generateTwoFactorSecret(
    ...params: Parameters<typeof Directus.generateTwoFactorSecret>
  ) {
    return this.client.request(DirectusSDK.generateTwoFactorSecret(...params));
  }
  public importFile<
    Schema,
    TQuery extends Directus.Query<CollectionsType, Collections.DirectusFile>,
  >(
    url: string,
    data?: Partial<Collections.DirectusFile>,
    query?: TQuery,
  ): Promise<
    ApplyQueryFields<
      CollectionsType,
      Collections.DirectusFile,
      TQuery extends undefined
        ? ["*"]
        : TQuery["fields"] extends undefined
          ? ["*"]
          : TQuery["fields"] extends Readonly<any[]>
            ? TQuery["fields"]
            : ["*"]
    >
  > {
    return this.client.request(
      DirectusSDK.importFile<CollectionsType, TQuery>(url, data, query),
    ) as any;
  }
  public inviteShare(...params: Parameters<typeof Directus.inviteShare>) {
    return this.client.request(DirectusSDK.inviteShare(...params));
  }
  public inviteUser(...params: Parameters<typeof Directus.inviteUser>) {
    return this.client.request(DirectusSDK.inviteUser(...params));
  }
  public login(...params: Parameters<typeof Directus.login>) {
    return this.client.request(DirectusSDK.login(...params));
  }
  public logout(...params: Parameters<typeof Directus.logout>) {
    return this.client.request(DirectusSDK.logout(...params));
  }
  public passwordRequest(
    ...params: Parameters<typeof Directus.passwordRequest>
  ) {
    return this.client.request(DirectusSDK.passwordRequest(...params));
  }
  public passwordReset(...params: Parameters<typeof Directus.passwordReset>) {
    return this.client.request(DirectusSDK.passwordReset(...params));
  }
  public promoteContentVersion<Collection extends keyof CollectionsType>(
    ...params: Parameters<
      typeof Directus.promoteContentVersion<CollectionsType, Collection>
    >
  ) {
    return this.client.request(DirectusSDK.promoteContentVersion(...params));
  }
  public randomString(...params: Parameters<typeof Directus.randomString>) {
    return this.client.request(DirectusSDK.randomString(...params));
  }
  public refresh(...params: Parameters<typeof Directus.refresh>) {
    return this.client.request(DirectusSDK.refresh(...params));
  }
  public registerUser(...params: Parameters<typeof Directus.registerUser>) {
    return this.client.request(DirectusSDK.registerUser(...params));
  }
  public registerUserVerify(
    ...params: Parameters<typeof Directus.registerUserVerify>
  ) {
    return this.client.request(DirectusSDK.registerUserVerify(...params));
  }
  public saveToContentVersion(
    ...params: Parameters<typeof Directus.saveToContentVersion>
  ) {
    return this.client.request(DirectusSDK.saveToContentVersion(...params));
  }
  public schemaApply(...params: Parameters<typeof Directus.schemaApply>) {
    return this.client.request(DirectusSDK.schemaApply(...params));
  }
  public schemaDiff(...params: Parameters<typeof Directus.schemaDiff>) {
    return this.client.request(DirectusSDK.schemaDiff(...params));
  }
  public schemaSnapshot(...params: Parameters<typeof Directus.schemaSnapshot>) {
    return this.client.request(DirectusSDK.schemaSnapshot(...params));
  }
  public serverHealth(...params: Parameters<typeof Directus.serverHealth>) {
    return this.client.request(DirectusSDK.serverHealth(...params));
  }
  public serverInfo(...params: Parameters<typeof Directus.serverInfo>) {
    return this.client.request(DirectusSDK.serverInfo(...params));
  }
  public serverPing(...params: Parameters<typeof Directus.serverPing>) {
    return this.client.request(DirectusSDK.serverPing(...params));
  }
  public triggerFlow(...params: Parameters<typeof Directus.triggerFlow>) {
    return this.client.request(DirectusSDK.triggerFlow(...params));
  }
  public triggerOperation(
    ...params: Parameters<typeof Directus.triggerOperation>
  ) {
    return this.client.request(DirectusSDK.triggerOperation(...params));
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
    ApplyQueryFields<
      CollectionsType,
      Collections.DirectusFile,
      TQuery extends undefined
        ? ["*"]
        : TQuery["fields"] extends undefined
          ? ["*"]
          : TQuery["fields"] extends Readonly<any[]>
            ? TQuery["fields"]
            : ["*"]
    >
  > {
    return this.client.request(
      DirectusSDK.uploadFiles<CollectionsType, TQuery>(data, query),
    ) as any;
  }
  public utilitySort(...params: Parameters<typeof Directus.utilitySort>) {
    return this.client.request(DirectusSDK.utilitySort(...params));
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
    return this.client.request(
      DirectusSDK.utilsExport(collection, format, query, file),
    );
  }
  public utilsImport(...params: Parameters<typeof Directus.utilsImport>) {
    return this.client.request(DirectusSDK.utilsImport(...params));
  }
  public verifyHash(...params: Parameters<typeof Directus.verifyHash>) {
    return this.client.request(DirectusSDK.verifyHash(...params));
  }
  public withOptions(...params: Parameters<typeof Directus.withOptions>) {
    return this.client.request(DirectusSDK.withOptions(...params));
  }
  public withSearch(...params: Parameters<typeof Directus.withSearch>) {
    return this.client.request(DirectusSDK.withSearch(...params));
  }
  public withToken(...params: Parameters<typeof Directus.withToken>) {
    return this.client.request(DirectusSDK.withToken(...params));
  }
}
