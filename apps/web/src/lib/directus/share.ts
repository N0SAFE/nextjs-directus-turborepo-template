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

export const directusUrl = (process.env as any).NEXT_PUBLIC_API_URL!
