import {
    authentication,
    AuthenticationClient,
    DirectusClient,
    rest,
    RestClient,
    WebSocketClient,
} from '@repo/directus-sdk'
import { createDefaultDirectusInstance, directusUrl } from './share'
import { Schema, TypedClient } from '@repo/directus-sdk/client'

export const createDirectusEdge = (
    url: string
): DirectusClient<Schema> &
    RestClient<Schema> &
    TypedClient &
    WebSocketClient<Schema> &
    AuthenticationClient<Schema> => {
    const directusInstance = createDefaultDirectusInstance(url).with(
        rest({
            credentials: 'include',
            onRequest: (options) => ({
                ...options,
                cache: 'force-cache',
            }),
        })
    )
    return directusInstance.with(
        authentication('json', {
            autoRefresh: false,
            credentials: 'include',
        })
    )
}

export const createDirectusEdgeWithDefaultUrl = (): ReturnType<
    typeof createDirectusEdge
> => {
    return createDirectusEdge(directusUrl!)
}
