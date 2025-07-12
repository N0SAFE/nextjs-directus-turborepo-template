import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse,
} from 'next/server'
import { Matcher, MiddlewareFactory } from './utils/types'
import { serverHealth, withToken } from '@repo/directus-sdk'
import { validateEnvSafe } from '#/env'
import {
    directusProxy,
    nextauthNoApi,
    nextjsRegexpPageOnly,
} from './utils/static'
import { createDirectusEdgeWithDefaultUrl } from '@/lib/directus/directus-edge'

const env = validateEnvSafe(process.env).data
const errorPageRenderingPath = '/middleware/error/healthCheck'

const withHealthCheck: MiddlewareFactory = (next: NextMiddleware) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        console.log(
            `Health Check Middleware: Checking server health for ${request.nextUrl.pathname}`,
            request.nextUrl.pathname
        )
        if (env?.NODE_ENV === 'development') {
            try {
                const directus = createDirectusEdgeWithDefaultUrl()
                console.log(
                    'Directus instance created with url:',
                    directus.url.href
                )
                try {
                    const data = await (env.API_ADMIN_TOKEN
                        ? directus.request(
                              withToken(env.API_ADMIN_TOKEN, serverHealth())
                          )
                        : directus.serverHealth())
                    console.log('Health Check Response:', data)
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
                    console.log('Health Check Error:', e)
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

export const matcher: Matcher = [
    {
        and: [
            nextjsRegexpPageOnly,
            nextauthNoApi,
            {
                not:
                    process.env.NEXT_PUBLIC_APP_DIRECTUS_PROXY_PATH ||
                    directusProxy,
            },
        ],
    },
]
