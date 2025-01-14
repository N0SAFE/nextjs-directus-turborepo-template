import {
    DirectusFileNamespace,
    DirectusItemType,
    getFileUrl,
    TypedDirectusClient,
} from '@repo/directus-sdk/utils'

import type { JSX } from 'react'

export interface RenderPropsFile extends Omit<DirectusFileProps, 'render'> {
    url: string | undefined
}

export type DirectusFileRenderer = (props: RenderPropsFile) => JSX.Element

export interface DirectusFileProps extends DirectusFileNamespace.Props {
    /** The Directus client that should be used to fetch the image. */
    directus: TypedDirectusClient & {
        getToken?: () => Promise<string | null>
    }
    /** url to your Directus instance. */
    apiUrl?: string
    /** The asset that should be rendered. */
    asset: DirectusItemType
    /** A function that returns the React element to be rendered.*/
    render: (props: RenderPropsFile) => React.ReactElement<any>
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

export const DirectusFile: React.FC<DirectusFileProps> = ({
    directus,
    apiUrl: propsApiUrl,
    accessToken: propsAccessToken,
    asset,
    download,
    filename,
    directusTransform,
    render,
}) => {
    const fileUrl = getFileUrl(directus, asset, {
        accessToken: propsAccessToken ?? undefined,
        directusTransform,
        download,
        filename,
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
