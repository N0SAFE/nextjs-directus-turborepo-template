import type * as Directus from '@directus/sdk'

import type { ApplyQueryFields } from '../../types/ApplyQueryFields'

import type { Collections, Schema } from '../../client'

import { toSafe, type ToSafeOutput } from '../../utils/index'
import {
    aggregateDirectusFieldItems,
    createDirectusFieldItem,
    deleteDirectusFieldItem,
    readDirectusFieldItem,
    readDirectusFieldItems,
    updateDirectusFieldItem,
} from '../../commands/DirectusField.commands'
import ChainableBinding from '../chainable-bindable'

export class DirectusFieldItems extends ChainableBinding {
    /**
     * Read any items from the collection.
     */
    async query<Output = Collections.DirectusField[]>(): Promise<
        ToSafeOutput<Output>
    > {
        return toSafe(
            this.request(readDirectusFieldItems()) as unknown as Promise<Output>
        )
    }

    /**
     * Aggregates the items in the collection.
     */
    async aggregate<
        Options extends Directus.AggregationOptions<Schema, 'directus_fields'>,
        Output = Directus.AggregationOutput<
            Schema,
            'directus_fields',
            Options
        >[number],
    >(options: Options): Promise<ToSafeOutput<Output>> {
        return toSafe(
            this.request(aggregateDirectusFieldItems<Options>(options)).then(
                (a) => a?.[0]
            ) as unknown as Promise<Output>
        )
    }
}

export class DirectusFieldItem extends ChainableBinding {
    /**
     * Create a single item in the collection.
     */
    async create<
        const Query extends Directus.Query<Schema, Collections.DirectusField>,
        Output = ApplyQueryFields<
            Schema,
            Collections.DirectusField,
            Query['fields']
        >,
    >(
        collection: keyof Schema,
        item: Partial<Collections.DirectusField>,
        query?: Query
    ): Promise<ToSafeOutput<Output>> {
        return toSafe(
            this.request(
                createDirectusFieldItem(collection, item, query)
            ) as unknown as Promise<Output>
        )
    }

    /**
     * Read a single item from the collection.
     */
    async get(
        collection: keyof Schema,
        field: Directus.DirectusField<Schema>['field']
    ): Promise<ToSafeOutput<Directus.ReadFieldOutput<Schema>>> {
        return toSafe(
            this.request(
                readDirectusFieldItem(collection, field)
            ) as unknown as Promise<Directus.ReadFieldOutput<Schema>>
        )
    }

    /**
     * Update a single item from the collection.
     */
    async update<
        const Query extends Directus.Query<Schema, Collections.DirectusField>,
        Output = ApplyQueryFields<
            Schema,
            Collections.DirectusField,
            Query['fields']
        >,
    >(
        key: Collections.DirectusField extends { collection: number | string }
            ? Collections.DirectusField['collection']
            : string | number,
        field: Directus.DirectusField<Schema>['field'],
        patch: Partial<Collections.DirectusField>,
        query?: Query
    ): Promise<ToSafeOutput<Output>> {
        return toSafe(
            this.request(
                updateDirectusFieldItem(key, field, patch, query)
            ) as unknown as Promise<Output>
        )
    }

    /**
     * Remove any items in the collection.
     */
    async remove<Output = void>(
        collection: Directus.DirectusField<Schema>['collection'],
        field: Directus.DirectusField<Schema>['field']
    ): Promise<ToSafeOutput<Output>> {
        return toSafe(
            this.request(
                deleteDirectusFieldItem(collection, field)
            ) as unknown as Promise<Output>
        )
    }
}
