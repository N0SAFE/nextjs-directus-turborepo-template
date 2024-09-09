import { graphql, realtime, DirectusClient, RestClient } from '@repo/directus-sdk'
import { createTypedClient, Schema, TypedClient } from '@repo/directus-sdk/client'

export const createDefaultDirectusInstance = (url: string) => {
    return (createTypedClient(url) as DirectusClient<Schema> & RestClient<Schema> & TypedClient)
        .with(realtime())
        .with(graphql({ credentials: 'include' }))
}

export const directusUrl = (process.env as any).NEXT_PUBLIC_API_URL!
