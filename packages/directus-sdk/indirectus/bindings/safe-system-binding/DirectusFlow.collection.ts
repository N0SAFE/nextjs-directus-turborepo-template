import type * as Directus from '@directus/sdk'

import type * as DirectusSDK from '@directus/sdk'

import type { ApplyQueryFields } from '../../types/ApplyQueryFields'

import type { Collections, Schema } from '../../client'

import { toSafe, type ToSafeOutput } from '../../utils/index'
import {
    aggregateDirectusFlowItems,
    createDirectusFlowItem,
    createDirectusFlowItems,
    deleteDirectusFlowItem,
    deleteDirectusFlowItems,
    readDirectusFlowItem,
    readDirectusFlowItems,
    updateDirectusFlowItem,
    updateDirectusFlowItems,
} from '../../commands/DirectusFlow.commands'
import ChainableBinding from '../chainable-bindable'

export class DirectusFlowItems extends ChainableBinding {
    /**
     * Creates many items in the collection.
     */
    async create<
        const Query extends DirectusSDK.Query<Schema, Collections.DirectusFlow>,
        Output = ApplyQueryFields<
            Schema,
            Collections.DirectusFlow,
            Query['fields']
        >[],
    >(
        items: Partial<Collections.DirectusFlow>[],
        query?: Query
    ): Promise<ToSafeOutput<Output>> {
        return toSafe(
            this.request(
                createDirectusFlowItems(items, query)
            ) as unknown as Promise<Output>
        )
    }

    /**
     * Read many items from the collection.
     */
    async query<
        const Query extends Directus.Query<Schema, Collections.DirectusFlow>,
        Output = ApplyQueryFields<
            Schema,
            Collections.DirectusFlow,
            Query['fields']
        >[],
    >(query?: Query): Promise<ToSafeOutput<Output>> {
        return toSafe(
            this.request(
                readDirectusFlowItems(query)
            ) as unknown as Promise<Output>
        )
    }

    /**
     * Read the first item from the collection matching the query.
     */
    async find<
        const Query extends Directus.Query<Schema, Collections.DirectusFlow>,
        Output = ApplyQueryFields<
            Schema,
            Collections.DirectusFlow,
            Query['fields']
        >,
    >(query?: Query): Promise<ToSafeOutput<Output | undefined>> {
        return toSafe(
            this.client
                .request(
                    readDirectusFlowItems({
                        ...query,
                        limit: 1,
                    })
                )
                .then((items) => items?.[0]) as unknown as Promise<
                Output | undefined
            >
        )
    }

    /**
     * Update many items in the collection.
     */
    async update<
        const Query extends Directus.Query<
            Schema,
            Directus.DirectusFlow<Schema>
        >,
        Output = ApplyQueryFields<
            Schema,
            Collections.DirectusFlow,
            Query['fields']
        >[],
    >(
        keys: Collections.DirectusFlow extends { id: number | string }
            ? Collections.DirectusFlow['id'][]
            : string[] | number[],
        patch: Partial<Collections.DirectusFlow>,
        query?: Query
    ): Promise<ToSafeOutput<Output>> {
        return toSafe(
            this.request(
                updateDirectusFlowItems(keys, patch, query)
            ) as unknown as Promise<Output>
        )
    }

    /**
     * Remove many items in the collection.
     */
    async remove<Output = void>(
        keys: Collections.DirectusFlow extends { id: number | string }
            ? Collections.DirectusFlow['id'][]
            : string[] | number[]
    ): Promise<ToSafeOutput<Output>> {
        return toSafe(
            this.request(
                deleteDirectusFlowItems(keys)
            ) as unknown as Promise<Output>
        )
    }

    /**
     * Aggregates the items in the collection.
     */
    async aggregate<
        Options extends Directus.AggregationOptions<Schema, 'directus_flows'>,
        Output = Directus.AggregationOutput<
            Schema,
            'directus_flows',
            Options
        >[number],
    >(options: Options): Promise<ToSafeOutput<Output>> {
        return toSafe(
            this.request(aggregateDirectusFlowItems<Options>(options)).then(
                (a) => a?.[0]
            ) as unknown as Promise<Output>
        )
    }
}

export class DirectusFlowItem extends ChainableBinding {
    /**
     * Create a single item in the collection.
     */
    async create<
        const Query extends Directus.Query<Schema, Collections.DirectusFlow>,
        Output = ApplyQueryFields<
            Schema,
            Collections.DirectusFlow,
            Query['fields']
        >,
    >(
        item: Partial<Collections.DirectusFlow>,
        query?: Query
    ): Promise<ToSafeOutput<Output>> {
        return toSafe(
            this.request(
                createDirectusFlowItem(item, query)
            ) as unknown as Promise<Output>
        )
    }

    /**
     * Read a single item from the collection.
     */
    async get<
        const Query extends Directus.Query<Schema, Collections.DirectusFlow>,
        Output = ApplyQueryFields<
            Schema,
            Collections.DirectusFlow,
            Query['fields']
        >,
    >(
        key: Collections.DirectusFlow extends { id: number | string }
            ? Collections.DirectusFlow['id']
            : string | number,
        query?: Query
    ): Promise<ToSafeOutput<Output>> {
        return toSafe(
            this.request(
                readDirectusFlowItem(key, query)
            ) as unknown as Promise<Output>
        )
    }

    /**
     * Update a single item from the collection.
     */
    async update<
        const Query extends Directus.Query<Schema, Collections.DirectusFlow>,
        Output = ApplyQueryFields<
            Schema,
            Collections.DirectusFlow,
            Query['fields']
        >,
    >(
        key: Collections.DirectusFlow extends { id: number | string }
            ? Collections.DirectusFlow['id']
            : string | number,
        patch: Partial<Collections.DirectusFlow>,
        query?: Query
    ): Promise<ToSafeOutput<Output>> {
        return toSafe(
            this.request(
                updateDirectusFlowItem(key, patch, query)
            ) as unknown as Promise<Output>
        )
    }

    /**
     * Remove many items in the collection.
     */
    async remove<Output = void>(
        key: Collections.DirectusFlow extends { id: number | string }
            ? Collections.DirectusFlow['id']
            : string | number
    ): Promise<ToSafeOutput<Output>> {
        return toSafe(
            this.request(
                deleteDirectusFlowItem(key)
            ) as unknown as Promise<Output>
        )
    }
}
