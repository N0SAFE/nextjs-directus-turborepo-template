import { graphql, realtime, rest } from '@directus/sdk'
import { createTypedClient } from '@/types/directus/generated/client'

export const createDefaultDirectusInstance = (url: string) => {
    return createTypedClient(url)
        .with(
            rest({
                credentials: 'include',
                onRequest: (options) => ({ ...options, cache: 'no-store' }),
            })
        )
        .with(realtime())
        .with(graphql({ credentials: 'include' }))
}

export const directusUrl = (process.env as any).NEXT_PUBLIC_API_URL!
