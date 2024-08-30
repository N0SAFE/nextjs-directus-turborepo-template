import { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server'
import { Matcher, MiddlewareFactory } from './utils/types'
import { nextauthNoApi, nextjsRegexpPageOnly } from './utils/static'
import { setCookie } from 'cookies-next'

export const withHeaders: MiddlewareFactory = (next: NextMiddleware) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        const res = await next(request, _next)
        if (res) {
            res.headers.set('x-pathname', request.nextUrl.pathname)
            setCookie('x-pathname', request.nextUrl.pathname, {
                req: request,
                res: res,
            })
        }
        return res
    }
}

export const matcher: Matcher = [{ and: [nextjsRegexpPageOnly, nextauthNoApi] }]
