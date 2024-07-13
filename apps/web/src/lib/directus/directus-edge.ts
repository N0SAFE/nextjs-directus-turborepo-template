import { authentication } from '@repo/directus-sdk'
import { createDefaultDirectusInstance, directusUrl } from './share'

export const createDirectusEdge = (url: string) => {
    const directusInstance = createDefaultDirectusInstance(url)
    return directusInstance.with(
        authentication('json', {
            credentials: 'include',
            autoRefresh: true,
        })
    )
}

export const createDirectusEdgeWithDefaultUrl = () => {
    return createDirectusEdge(directusUrl!)
}
