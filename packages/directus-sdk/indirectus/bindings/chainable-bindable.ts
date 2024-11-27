import type { Schema } from '../client'
import type * as Directus from '@directus/sdk'
import * as DirectusSDK from '@directus/sdk'

export default class ChainableBinding {
    private chain: ((
        lastRestCommand: Directus.RestCommand<unknown, Schema>
    ) => Directus.RestCommand<unknown, Schema>)[] = [];

    declare ['constructor']: typeof ChainableBinding

    constructor(
        protected client: Directus.DirectusClient<Schema> &
            Directus.RestClient<Schema>
    ) {}

    async request<Output>(options: Directus.RestCommand<Output, Schema>) {
        const recursiveConsumeChain = (
            chain: typeof this.chain,
            content: Directus.RestCommand<Output, Schema>
        ) => {
            if (chain.length === 0) {
                return content
            }
            const [head, ...tail] = chain
            return recursiveConsumeChain(tail, head(content))
        }
        return this.client.request(
            recursiveConsumeChain(this.chain, options)
        ) as unknown as Promise<Output>
    }

    withOptions(
        extraOptions: Directus.RequestTransformer | Partial<RequestInit>
    ) {
        const newFunc = (last: Directus.RestCommand<unknown, Schema>) => {
            return DirectusSDK.withOptions(last, extraOptions)
        }
        const obj = new this.constructor(this.client) as this
        obj.chain = [...this.chain, newFunc]
        return obj
    }

    withToken(token: string) {
        const newFunc = (last: Directus.RestCommand<unknown, Schema>) => {
            return DirectusSDK.withToken(token, last)
        }
        const obj = new this.constructor(this.client) as this
        obj.chain = [...this.chain, newFunc]
        return obj
    }

    withSearch() {
        const newFunc = (last: Directus.RestCommand<unknown, Schema>) => {
            return DirectusSDK.withSearch(last)
        }
        const obj = new this.constructor(this.client) as this
        obj.chain = [...this.chain, newFunc]
        return obj
    }

    withCustom(
        custom: (
            last: Directus.RestCommand<unknown, Schema>
        ) => Directus.RestCommand<unknown, Schema>
    ) {
        const obj = new this.constructor(this.client) as this
        obj.chain = [...this.chain, custom]
        return obj
    }
}
