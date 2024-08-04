import {
    ApplyQueryFields,
    CollectionType,
    DirectusClient,
    Query,
    RegularCollections,
} from '@directus/sdk'
import { Types, Schema } from './client'
import { Collections } from '@repo/directus-sdk/client'

export type __unfinished_ApplyFields<
    Collection extends RegularCollections<Schema>,
    Fields extends Query<Schema, CollectionType<Schema, Collection>>['fields'],
> = ApplyQueryFields<Schema, CollectionType<Schema, Collection>, Fields>

export type ItemNoRelations<Collection extends object> = {
    [Key in keyof Collection]: Collection[Key] extends { id: any }
        ? DirectusItemExcludeRelations<Collection[Key]>
        : Collection[Key] extends { id: any }[]
          ? DirectusItemExcludeRelations<Collection[Key][number]>[]
          : Collection[Key]
}

export type DirectusIdType = string | number

// Define a more flexible Item type that can cover various scenarios
export type DirectusItemType =
    | { id: DirectusIdType }
    | DirectusIdType
    | undefined
    | null

export type DirectusItemIntoRelation<T extends DirectusItemType> =
    | RelationType<T>
    | RelationType<T>['id']

export type RelationIdType<T extends DirectusItemType> = Exclude<
    T extends { id: infer U } ? U : T,
    { id?: DirectusIdType }
>

export type RelationType<T extends DirectusItemType> = Exclude<
    T,
    string | number | null | undefined
>

export type DirectusItemExcludeRelations<T extends DirectusItemType> =
    | Exclude<T, { id: any }>
    | RelationIdType<T>

// Refactor the getItemId function to use a more straightforward generic approach
export function getItemId<T extends DirectusItemType>(
    item: T
): RelationIdType<T> {
    if (typeof item === 'object' && item !== null && 'id' in item) {
        // Explicitly cast the return type based on the conditional type
        return item.id as RelationIdType<T>
    }
    // Handle cases where item is not an object or doesn't have an 'id' property
    return item as RelationIdType<T>
}

export function getFileUrl<Schema>(
    directus: DirectusClient<Schema>,
    item?: DirectusItemType,
    options?: DirectusFile.Props
) {
    if (!item) return
    const searchParams = new URLSearchParams()
    if (options?.accessToken) {
        searchParams.set('access_token', options.accessToken)
    }
    if (options?.download) {
        searchParams.set('download', '')
    }
    if ('string' === typeof options?.directusTransform) {
        searchParams.set('directus_transform', options.directusTransform)
    } else if ('object' === typeof options?.directusTransform) {
        // Adds all the custom transforms to the params
        for (const [key, value] of Object.entries(options?.directusTransform)) {
            if (value) {
                searchParams.append(key, value.toString())
            }
        }
    }
    return `${directus.url}assets/${getItemId(item)}${options?.filename ? '/' + options?.filename : ''}?${searchParams.toString()}`
}

export function useFileUrl<
    Schema,
    DirectusInstance extends DirectusClient<Schema>,
>(directus: DirectusInstance, globalOptions?: DirectusFile.Props) {
    return (item?: DirectusItemType, options?: DirectusFile.Props) =>
        getFileUrl(directus, item, {
            ...globalOptions,
            ...options,
        })
}

export function getRelation<
    T extends string | number | object | null | undefined,
    R extends boolean,
>(
    relation: T,
    required: R
): T extends object | null | undefined
    ? R extends true
        ? NonNullable<T>
        : T
    : never {
    if (required) {
        if (relation === null || relation === undefined) {
            throw new Error('relation is not loaded')
        }
    }
    if (relation === undefined || typeof relation === 'object') {
        return relation as T extends object | null | undefined
            ? R extends true
                ? NonNullable<T>
                : T
            : never
    }
    throw new Error('relation is not loaded')
}

export function getStringDate<
    T extends Types.Date | Types.DateTime | null | undefined,
>(date: T) {
    if (date instanceof Date) {
        return date.toISOString()
    } else {
        return date as Exclude<T, Date>
    }
}

export namespace DirectusFile {
    /**
     * The fit of the thumbnail while always preserving the aspect ratio.
     */
    export enum Fit {
        /** Covers both width/height by cropping/clipping to fit */
        cover = 'cover',
        /** Contain within both width/height using "letterboxing" as needed */
        contain = 'contain',
        /** Resize to be as large as possible, ensuring dimensions are less than or equal to the requested width and height */
        inside = 'inside',
        /** Resize to be as small as possible, ensuring dimensions are greater than or equal to the requested width and height */
        outside = 'outside',
    }

    /**
     *  What file format to return the image in.
     */
    export enum Format {
        /** Will try to format it in ´webp´ or ´avif´ if the browser supports it, otherwise it will fallback to ´jpg´. */
        auto = 'auto',
        jpg = 'jpg',
        png = 'png',
        webp = 'webp',
        tiff = 'tiff',
    }

    /**
     * Represents the {@link https://docs.directus.io/reference/files.html#requesting-a-thumbnail | Custom Transformations} you can apply to an image.
     */
    export interface TransformCustomProp {
        /** The width of the thumbnail in pixels.*/
        width: number
        /** The height of the thumbnail in pixels. */
        height: number
        /** The quality of the thumbnail (1 to 100). */
        quality: number
        /** The fit of the thumbnail while always preserving the aspect ratio. */
        fit: Fit
        /** The file format of the thumbnail. */
        format: Format
        /** Disable image up-scaling. */
        withoutEnlargement: boolean
        /** An array of sharp operations to apply to the image. {@link https://sharp.pixelplumbing.com/api-operation | Sharp API}*/
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transforms: [string, ...any[]][]
    }

    export interface Props {
        /** The current user's access token. */
        accessToken?: string
        /** If the asset should be downloaded instead of rendered. */
        download?: boolean
        /** Either a preset key or a custom transform object. */
        directusTransform?: Partial<TransformCustomProp> | string
        /**
         * The filename of the image. If the filename is not provided, the image will be downloaded with the asset's id as filename.
         * {@link https://docs.directus.io/reference/files.html#accessing-a-file| SEO}
         */
        filename?: string
    }
}
