import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse,
} from 'next/server'
import { Matcher, MiddlewareFactory } from './utils/types'
import { serverHealth, withToken } from '@repo/directus-sdk'
import { validateEnvSafe } from '#/env'
import { nextauthNoApi, nextjsRegexpPageOnly } from './utils/static'
import { createDirectusEdgeWithDefaultUrl } from '@/lib/directus/directus-edge'

const errorPageRenderingPath = '/middleware/error/healthCheck'

const withHealthCheck: MiddlewareFactory = (next: NextMiddleware) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        if (request.nextUrl.pathname.startsWith('/_next')) {
            return await next(request, _next)
        }
        const env = validateEnvSafe(process.env).data
        if (env?.NODE_ENV === 'development') {
            try {
                const directus = createDirectusEdgeWithDefaultUrl()
                try {
                    const data = await (env.API_ADMIN_TOKEN
                        ? directus.request(
                              withToken(env.API_ADMIN_TOKEN, serverHealth())
                          )
                        : directus.request(serverHealth()))
                    if (!(data.status === 'ok')) {
                        if (
                            request.nextUrl.pathname === errorPageRenderingPath
                        ) {
                            return NextResponse.next()
                        } else {
                            return NextResponse.redirect(
                                request.nextUrl.origin +
                                    errorPageRenderingPath +
                                    `?json=${JSON.stringify(data)}&from=${encodeURIComponent(request.url)}`
                            )
                        }
                    }
                } catch (e: any) {
                    if (e.response.status === 401) {
                        const data = await directus.request(serverHealth())
                        if (!(data.status === 'ok')) {
                            if (
                                request.nextUrl.pathname ===
                                errorPageRenderingPath
                            ) {
                                return NextResponse.next()
                            } else {
                                return NextResponse.redirect(
                                    request.nextUrl.origin +
                                        errorPageRenderingPath +
                                        `?json=${JSON.stringify(data)}&from=${encodeURIComponent(request.url)}`
                                )
                            }
                        }
                    }
                }
            } catch (e) {
                if (request.nextUrl.pathname === errorPageRenderingPath) {
                    return NextResponse.next()
                } else {
                    return NextResponse.redirect(
                        request.nextUrl.origin +
                            errorPageRenderingPath +
                            `?from=${encodeURIComponent(request.url)}`
                    )
                }
            }
        }
        if (request.nextUrl.pathname === errorPageRenderingPath) {
            return NextResponse.redirect(
                request.nextUrl.searchParams.get('from') ||
                    request.nextUrl.origin + '/'
            )
        }
        return await next(request, _next)
    }
}

export default withHealthCheck

export const matcher: Matcher = [{ and: [nextjsRegexpPageOnly, nextauthNoApi] }]
