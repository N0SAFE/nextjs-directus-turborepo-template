import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse,
} from 'next/server'
import { Matcher, MiddlewareFactory } from './utils/types'
import { envIsValid, validateEnvSafe } from '#/env'
import { nextjsRegexpPageOnly, nextNoApi, noPublic } from './utils/static'
import { matcherHandler } from './utils/utils'

const errorPageRenderingPath = '/middleware/error/env'

const withEnv: MiddlewareFactory = (next: NextMiddleware) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        const isValid = envIsValid(process.env as any)
        const matcher = matcherHandler(request.nextUrl.pathname, [
            [
                errorPageRenderingPath,
                () => {
                    if (isValid) {
                        return NextResponse.redirect(
                            request.nextUrl.searchParams.get('from') ||
                                request.nextUrl.origin + '/'
                        )
                    }
                },
            ],
            [
                { not: errorPageRenderingPath },
                () => {
                    if (isValid) {
                        return next(request, _next)
                    } else {
                        if (process.env?.NODE_ENV === 'development') {
                            return NextResponse.redirect(
                                request.nextUrl.origin +
                                    errorPageRenderingPath +
                                    `?from=${encodeURIComponent(request.url)}`
                            )
                        } else {
                            throw new Error(
                                'Invalid environment variables:' +
                                    JSON.stringify(
                                        validateEnvSafe(process.env).error
                                    )
                            )
                        }
                    }
                },
            ],
        ])
        if (matcher.hit) {
            return matcher.data
        }
        return next(request, _next)
    }
}

export default withEnv

export const matcher: Matcher = [
    { and: [nextjsRegexpPageOnly, nextNoApi, noPublic] },
]
