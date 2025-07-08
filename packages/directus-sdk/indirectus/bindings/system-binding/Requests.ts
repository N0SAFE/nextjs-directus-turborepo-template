import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";
import ChainableBinding from "../chainable-bindable";

export class Requests extends ChainableBinding {
  constructor(
    client: Directus.DirectusClient<Schema> & Directus.RestClient<Schema>,
  ) {
    super(client);
  }
  public acceptUserInvite(
    ...params: Parameters<typeof Directus.acceptUserInvite>
  ) {
    return this.request(DirectusSDK.acceptUserInvite(...params));
  }
  public aggregate<
    Collection extends DirectusSDK.AllCollections<Schema>,
    Options extends Directus.AggregationOptions<Schema, Collection>,
    Output extends DirectusSDK.AggregationOutput<
      Schema,
      Collection,
      Options
    >[number],
  >(collection: Collection, options: Options): Promise<Output> {
    return this.client
      .request(DirectusSDK.aggregate(collection, options))
      .then((res) => res[0]) as unknown as Promise<Output>;
  }
  public authenticateShare(
    ...params: Parameters<typeof Directus.authenticateShare>
  ) {
    return this.request(DirectusSDK.authenticateShare(...params));
  }
  public clearCache(...params: Parameters<typeof Directus.clearCache>) {
    return this.request(DirectusSDK.clearCache(...params));
  }
  public compareContentVersion(
    ...params: Parameters<typeof Directus.compareContentVersion>
  ) {
    return this.request(DirectusSDK.compareContentVersion(...params));
  }
  public customEndpoint(...params: Parameters<typeof Directus.customEndpoint>) {
    return this.request(DirectusSDK.customEndpoint(...params));
  }
  public disableTwoFactor(
    ...params: Parameters<typeof Directus.disableTwoFactor>
  ) {
    return this.request(DirectusSDK.disableTwoFactor(...params));
  }
  public enableTwoFactor(
    ...params: Parameters<typeof Directus.enableTwoFactor>
  ) {
    return this.request(DirectusSDK.enableTwoFactor(...params));
  }
  public generateHash(...params: Parameters<typeof Directus.generateHash>) {
    return this.request(DirectusSDK.generateHash(...params));
  }
  public generateTwoFactorSecret(
    ...params: Parameters<typeof Directus.generateTwoFactorSecret>
  ) {
    return this.request(DirectusSDK.generateTwoFactorSecret(...params));
  }
  public importFile<
    TQuery extends Directus.Query<Schema, Collections.DirectusFile>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFile,
      TQuery["fields"]
    >,
  >(
    url: string,
    data?: Partial<Collections.DirectusFile>,
    query?: TQuery,
  ): Promise<Output> {
    return this.request(
      DirectusSDK.importFile<Schema, TQuery>(url, data, query),
    ) as Promise<Output>;
  }
  public inviteShare(...params: Parameters<typeof Directus.inviteShare>) {
    return this.request(DirectusSDK.inviteShare(...params));
  }
  public inviteUser(...params: Parameters<typeof Directus.inviteUser>) {
    return this.request(DirectusSDK.inviteUser(...params));
  }
  public login(...params: Parameters<typeof Directus.login>) {
    return this.request(DirectusSDK.login(...params));
  }
  public logout(...params: Parameters<typeof Directus.logout>) {
    return this.request(DirectusSDK.logout(...params));
  }
  public passwordRequest(
    ...params: Parameters<typeof Directus.passwordRequest>
  ) {
    return this.request(DirectusSDK.passwordRequest(...params));
  }
  public passwordReset(...params: Parameters<typeof Directus.passwordReset>) {
    return this.request(DirectusSDK.passwordReset(...params));
  }
  public promoteContentVersion<Collection extends keyof Schema>(
    ...params: Parameters<
      typeof Directus.promoteContentVersion<Schema, Collection>
    >
  ) {
    return this.request(DirectusSDK.promoteContentVersion(...params));
  }
  public randomString(...params: Parameters<typeof Directus.randomString>) {
    return this.request(DirectusSDK.randomString(...params));
  }
  public refresh(...params: Parameters<typeof Directus.refresh>) {
    return this.request(DirectusSDK.refresh(...params));
  }
  public registerUser(...params: Parameters<typeof Directus.registerUser>) {
    return this.request(DirectusSDK.registerUser(...params));
  }
  public registerUserVerify(
    ...params: Parameters<typeof Directus.registerUserVerify>
  ) {
    return this.request(DirectusSDK.registerUserVerify(...params));
  }
  public saveToContentVersion(
    ...params: Parameters<typeof Directus.saveToContentVersion>
  ) {
    return this.request(DirectusSDK.saveToContentVersion(...params));
  }
  public schemaApply(...params: Parameters<typeof Directus.schemaApply>) {
    return this.request(DirectusSDK.schemaApply(...params));
  }
  public schemaDiff(...params: Parameters<typeof Directus.schemaDiff>) {
    return this.request(DirectusSDK.schemaDiff(...params));
  }
  public schemaSnapshot(...params: Parameters<typeof Directus.schemaSnapshot>) {
    return this.request(DirectusSDK.schemaSnapshot(...params));
  }
  public serverHealth(...params: Parameters<typeof Directus.serverHealth>) {
    return this.request(DirectusSDK.serverHealth(...params));
  }
  public serverInfo(...params: Parameters<typeof Directus.serverInfo>) {
    return this.request(DirectusSDK.serverInfo(...params));
  }
  public serverPing(...params: Parameters<typeof Directus.serverPing>) {
    return this.request(DirectusSDK.serverPing(...params));
  }
  public triggerFlow(...params: Parameters<typeof Directus.triggerFlow>) {
    return this.request(DirectusSDK.triggerFlow(...params));
  }
  public triggerOperation(
    ...params: Parameters<typeof Directus.triggerOperation>
  ) {
    return this.request(DirectusSDK.triggerOperation(...params));
  }
  public uploadFiles<
    const TQuery extends Directus.Query<Schema, Collections.DirectusFile>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFile,
      TQuery["fields"]
    >,
  >(data: FormData, query?: TQuery): Promise<Output> {
    return this.request(
      DirectusSDK.uploadFiles<Schema, TQuery>(data, query),
    ) as unknown as Promise<Output>;
  }
  public utilitySort(...params: Parameters<typeof Directus.utilitySort>) {
    return this.request(DirectusSDK.utilitySort(...params));
  }
  public utilsExport<
    TQuery extends Directus.Query<Schema, Schema[Collection]>,
    Collection extends keyof Schema,
  >(
    collection: Collection,
    format: Directus.FileFormat,
    query: TQuery,
    file: Partial<Directus.DirectusFile<Schema>>,
  ) {
    return this.request(
      DirectusSDK.utilsExport(collection, format, query, file),
    );
  }
  public utilsImport(...params: Parameters<typeof Directus.utilsImport>) {
    return this.request(DirectusSDK.utilsImport(...params));
  }
  public verifyHash(...params: Parameters<typeof Directus.verifyHash>) {
    return this.request(DirectusSDK.verifyHash(...params));
  }
}
