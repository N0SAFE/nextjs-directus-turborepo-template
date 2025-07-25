import { createDirectusEdgeWithDefaultUrl } from '@/lib/directus/directus-edge'
import { refresh } from '@directus/sdk'

export const revalidate = 20
export const runtime = 'nodejs'

export const POST = async (req: Request) => {
    const data = await req.json()
    const { refresh_token } = data
    if (!refresh_token) {
        return Response.json(
            { error: 'refresh_token is required' },
            { status: 400 }
        )
    }
    const directus = createDirectusEdgeWithDefaultUrl()
    try {
        const authData = await directus.request(refresh('json', refresh_token))
        return Response.json(authData)
    } catch (error: unknown) {
        return Response.json(error, {
            status: (error as { response: { status: number } }).response.status,
        })
    }
}
