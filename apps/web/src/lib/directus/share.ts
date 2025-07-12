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

/**
 * Get the appropriate Directus URL based on the environment (server-side vs client-side)
 * - Server-side: Uses API_URL (internal Docker network URL)
 * - Client-side: Uses NEXT_PUBLIC_API_URL (localhost URL accessible from browser)
 */
export const getDirectusUrl = (): string => {
    // Check if we're on the server-side
    if (typeof window === 'undefined') {
        // Server-side: use internal Docker network URL
        return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL!
    } else {
        // Client-side: use localhost URL
        return process.env.NEXT_PUBLIC_API_URL!
    }
}

// Export the URL for backward compatibility
export const directusUrl = getDirectusUrl()
