import type * as Directus from "@directus/sdk";

import * as DirectusSDK from "@directus/sdk";

import { ApplyQueryFields } from "../../types/ApplyQueryFields";

import { Collections, Schema } from "../../client";

import { toSafe, ToSafeOutput } from "../../utils/index";
import ChainableBinding from "../chainable-bindable";

export class Requests extends ChainableBinding {
  constructor(
    client: Directus.DirectusClient<Schema> & Directus.RestClient<Schema>,
  ) {
    super(client);
  }
  public acceptUserInvite(
    ...params: Parameters<typeof DirectusSDK.acceptUserInvite>
  ) {
    return toSafe(this.request(DirectusSDK.acceptUserInvite(...params)));
  }
  public aggregate<
    Collection extends DirectusSDK.AllCollections<Schema>,
    Options extends Directus.AggregationOptions<Schema, Collection>,
    Output = DirectusSDK.AggregationOutput<Schema, Collection, Options>[number],
  >(collection: Collection, options: Options): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.client
        .request(DirectusSDK.aggregate(collection, options))
        .then((res) => res[0]),
    ) as unknown as Promise<ToSafeOutput<Output>>;
  }
  public authenticateShare(
    ...params: Parameters<typeof DirectusSDK.authenticateShare>
  ) {
    return toSafe(this.request(DirectusSDK.authenticateShare(...params)));
  }
  public clearCache(...params: Parameters<typeof DirectusSDK.clearCache>) {
    return toSafe(this.request(DirectusSDK.clearCache(...params)));
  }
  public compareContentVersion(
    ...params: Parameters<typeof DirectusSDK.compareContentVersion>
  ) {
    return toSafe(this.request(DirectusSDK.compareContentVersion(...params)));
  }
  public customEndpoint(
    ...params: Parameters<typeof DirectusSDK.customEndpoint>
  ) {
    return toSafe(this.request(DirectusSDK.customEndpoint(...params)));
  }
  public disableTwoFactor(
    ...params: Parameters<typeof DirectusSDK.disableTwoFactor>
  ) {
    return toSafe(this.request(DirectusSDK.disableTwoFactor(...params)));
  }
  public enableTwoFactor(
    ...params: Parameters<typeof DirectusSDK.enableTwoFactor>
  ) {
    return toSafe(this.request(DirectusSDK.enableTwoFactor(...params)));
  }
  public generateHash(...params: Parameters<typeof DirectusSDK.generateHash>) {
    return toSafe(this.request(DirectusSDK.generateHash(...params)));
  }
  public generateTwoFactorSecret(
    ...params: Parameters<typeof DirectusSDK.generateTwoFactorSecret>
  ) {
    return toSafe(this.request(DirectusSDK.generateTwoFactorSecret(...params)));
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
  ): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.request(DirectusSDK.importFile<Schema, TQuery>(url, data, query)),
    ) as unknown as Promise<ToSafeOutput<Output>>;
  }
  public inviteShare(...params: Parameters<typeof DirectusSDK.inviteShare>) {
    return toSafe(this.request(DirectusSDK.inviteShare(...params)));
  }
  public inviteUser(...params: Parameters<typeof DirectusSDK.inviteUser>) {
    return toSafe(this.request(DirectusSDK.inviteUser(...params)));
  }
  public login(...params: Parameters<typeof DirectusSDK.login>) {
    return toSafe(this.request(DirectusSDK.login(...params)));
  }
  public logout(...params: Parameters<typeof DirectusSDK.logout>) {
    return toSafe(this.request(DirectusSDK.logout(...params)));
  }
  public passwordRequest(
    ...params: Parameters<typeof DirectusSDK.passwordRequest>
  ) {
    return toSafe(this.request(DirectusSDK.passwordRequest(...params)));
  }
  public passwordReset(
    ...params: Parameters<typeof DirectusSDK.passwordReset>
  ) {
    return toSafe(this.request(DirectusSDK.passwordReset(...params)));
  }
  public promoteContentVersion<Collection extends keyof Schema>(
    ...params: Parameters<
      typeof DirectusSDK.promoteContentVersion<Schema, Collection>
    >
  ) {
    return toSafe(this.request(DirectusSDK.promoteContentVersion(...params)));
  }
  public randomString(...params: Parameters<typeof DirectusSDK.randomString>) {
    return toSafe(this.request(DirectusSDK.randomString(...params)));
  }
  public refresh(...params: Parameters<typeof DirectusSDK.refresh>) {
    return toSafe(this.request(DirectusSDK.refresh(...params)));
  }
  public registerUser(...params: Parameters<typeof DirectusSDK.registerUser>) {
    return toSafe(this.request(DirectusSDK.registerUser(...params)));
  }
  public registerUserVerify(
    ...params: Parameters<typeof DirectusSDK.registerUserVerify>
  ) {
    return toSafe(this.request(DirectusSDK.registerUserVerify(...params)));
  }
  public saveToContentVersion(
    ...params: Parameters<typeof DirectusSDK.saveToContentVersion>
  ) {
    return toSafe(this.request(DirectusSDK.saveToContentVersion(...params)));
  }
  public schemaApply(...params: Parameters<typeof DirectusSDK.schemaApply>) {
    return toSafe(this.request(DirectusSDK.schemaApply(...params)));
  }
  public schemaDiff(...params: Parameters<typeof DirectusSDK.schemaDiff>) {
    return toSafe(this.request(DirectusSDK.schemaDiff(...params)));
  }
  public schemaSnapshot(
    ...params: Parameters<typeof DirectusSDK.schemaSnapshot>
  ) {
    return toSafe(this.request(DirectusSDK.schemaSnapshot(...params)));
  }
  public serverHealth(...params: Parameters<typeof DirectusSDK.serverHealth>) {
    return toSafe(this.request(DirectusSDK.serverHealth(...params)));
  }
  public serverInfo(...params: Parameters<typeof DirectusSDK.serverInfo>) {
    return toSafe(this.request(DirectusSDK.serverInfo(...params)));
  }
  public serverPing(...params: Parameters<typeof DirectusSDK.serverPing>) {
    return toSafe(this.request(DirectusSDK.serverPing(...params)));
  }
  public triggerFlow(...params: Parameters<typeof DirectusSDK.triggerFlow>) {
    return toSafe(this.request(DirectusSDK.triggerFlow(...params)));
  }
  public triggerOperation(
    ...params: Parameters<typeof DirectusSDK.triggerOperation>
  ) {
    return toSafe(this.request(DirectusSDK.triggerOperation(...params)));
  }
  public uploadFiles<
    const TQuery extends Directus.Query<Schema, Collections.DirectusFile>,
    Output = ApplyQueryFields<
      Schema,
      Collections.DirectusFile,
      TQuery["fields"]
    >,
  >(data: FormData, query?: TQuery): Promise<ToSafeOutput<Output>> {
    return toSafe(
      this.request(DirectusSDK.uploadFiles<Schema, TQuery>(data, query)),
    ) as unknown as Promise<ToSafeOutput<Output>>;
  }
  public async utilitySort(
    ...params: Parameters<typeof DirectusSDK.utilitySort>
  ) {
    return toSafe(this.request(DirectusSDK.utilitySort(...params)));
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
    return toSafe(
      this.request(DirectusSDK.utilsExport(collection, format, query, file)),
    );
  }
  public utilsImport(...params: Parameters<typeof DirectusSDK.utilsImport>) {
    return toSafe(this.request(DirectusSDK.utilsImport(...params)));
  }
  public verifyHash(...params: Parameters<typeof DirectusSDK.verifyHash>) {
    return toSafe(this.request(DirectusSDK.verifyHash(...params)));
  }
}
