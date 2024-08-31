import { use } from 'react'
import {
    DirectusItemType,
    getFileUrl,
    TypedDirectusClient,
} from '@repo/directus-sdk/utils'

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
    transforms: [string, ...any[]][]
}

export interface RenderPropsFile extends Omit<DirectusFileProps, 'render'> {
    url: string | undefined
}

export type DirectusFileRenderer = (props: RenderPropsFile) => JSX.Element

export interface DirectusFileProps {
    /** The Directus client that should be used to fetch the image. */
    directus: TypedDirectusClient & {
        getToken?: () => Promise<string | null>
    }
    /** url to your Directus instance. */
    apiUrl?: string
    /** The current user's access token. */
    accessToken?: string
    /** The asset that should be rendered. */
    asset: DirectusItemType
    /** If the asset should be downloaded instead of rendered. */
    download?: boolean
    /** Either a preset key or a custom transform object. */
    directusTransform?: Partial<TransformCustomProp> | string
    /**
     * The filename of the image. If the filename is not provided, the image will be downloaded with the asset's id as filename.
     * {@link https://docs.directus.io/reference/files.html#accessing-a-file| SEO}
     */
    filename?: string
    /** A function that returns the React element to be rendered.*/
    render: (props: RenderPropsFile) => React.ReactNode
}

/**
 * DirectusFile is a React Component that renders an image from your Directus API.
 * @example Here is an example of how to use DirectusFile with a custom transform
 * ```tsx
 * import { DirectusFile } from 'react-directus';
import { getToken } from 'next-auth/jwt';
import { TypedDirectusClient } from '../../../../../directus-sdk/src/utils';
import { Schema } from '../../../../../directus-sdk/dist/client';
import { DirectusClient } from '@directus/sdk';
import directus from '@/lib/directus/index';
 *
 * export const MyImage = ({ imageId }) => (
 *  <DirectusFile
 *   asset={imageId}
 *   directusTransforms={{ width: 200, height: 200 }}
 *   render={({ url }) => <img src={url}
 * />}
 * ```
 *
 * @example Here is an example of how to use DirectusFile to download an file
 * ```tsx
 * import { DirectusFile } from 'react-directus';
 *
 * export const MyImage = ({ imageId }) => (
 *  <DirectusFile
 *   asset={imageId}
 *   download
 *   filename="my-file-name.jpg"
 *   render={({ url, filename })<a href={url} download={filename}}>Download</a>
 * />}
 *
 * ```
 */

export const DirectusFile = ({
    directus,
    apiUrl: propsApiUrl,
    accessToken: propsAccessToken,
    asset,
    download,
    filename,
    directusTransform,
    render,
}: DirectusFileProps): React.ReactNode => {
    const token = use(directus?.getToken?.() ?? Promise.resolve(null))

    const fileUrl = getFileUrl(directus, asset, {
        accessToken: propsAccessToken || (token ?? undefined),
        directusTransform,
        download,
        filename
    })

    return render({
        apiUrl: propsApiUrl,
        asset,
        url: fileUrl,
        download,
        directusTransform: directusTransform,
        directus,
    })
}
