import { authentication, rest } from '@repo/directus-sdk'
import { createDefaultDirectusInstance, directusUrl } from './share'

export const createDirectusEdge = (url: string) => {
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

export const createDirectusEdgeWithDefaultUrl = () => {
    return createDirectusEdge(directusUrl!)
}
