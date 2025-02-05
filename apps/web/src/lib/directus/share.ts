import {
    graphql,
    realtime,
    WebSocketClient,
    GraphqlClient,
} from '@repo/directus-sdk'
import { createTypedClient, Schema } from '@repo/directus-sdk/client'

export const createDefaultDirectusInstance = (
    url: string
): ReturnType<typeof createTypedClient> &
    WebSocketClient<Schema> &
    GraphqlClient<Schema> => {
    return createTypedClient(url)
        .with(realtime())
        .with(graphql({ credentials: 'include' }))
}

const NEXT_PUBLIC_APP_URL_WIHTOUT_SLASH_TAIL = (
    process.env as any
).NEXT_PUBLIC_APP_URL!.replace(/\/$/, '')
const NEXT_PUBLIC_APP_DIRECTUS_PROXY_PATH_WITH_MANDATORY_SLASH = `/${process.env.NEXT_PUBLIC_APP_DIRECTUS_PROXY_PATH?.replace(/^\//, '') || ''}`

export const directusUrl = process.env.NEXT_PUBLIC_APP_DIRECTUS_PROXY_PATH
    ? `${NEXT_PUBLIC_APP_URL_WIHTOUT_SLASH_TAIL}${NEXT_PUBLIC_APP_DIRECTUS_PROXY_PATH_WITH_MANDATORY_SLASH}`
    : process.env.NEXT_PUBLIC_API_URL // if a directus proxy is not used, use the API URL (this is done for the development environment when using docker because of private network)
