import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse,
} from 'next/server'
import { Matcher, MiddlewareFactory } from './utils/types'
import { envIsValid } from '#/env'
import { nextjsRegexpPageOnly, nextNoApi, noPublic } from './utils/static'

const errorPageRenderingPath = '/middleware/error/env'

const withEnv: MiddlewareFactory = (next: NextMiddleware) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        const isValid = envIsValid(process.env as any)
        if (!isValid) {
            if (request.nextUrl.pathname === errorPageRenderingPath) {
                return NextResponse.next()
            } else {
                return NextResponse.redirect(
                    request.nextUrl.origin +
                        errorPageRenderingPath +
                        `?from=${encodeURIComponent(request.url)}`
                )
            }
        } else {
            if (request.nextUrl.pathname === errorPageRenderingPath) {
                return NextResponse.redirect(
                    request.nextUrl.searchParams.get('from') ||
                        request.nextUrl.origin + '/'
                )
            }
        }

        return await next(request, _next)
    }
}

export default withEnv

export const matcher: Matcher = [
    { and: [nextjsRegexpPageOnly, nextNoApi, noPublic] },
]
