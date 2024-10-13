import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse,
} from 'next/server'
import { ConfigFactory, Matcher, MiddlewareFactory } from './utils/types'
import { nextauthNoApi, nextjsRegexpPageOnly } from './utils/static'
import { auth, pages } from '@/lib/auth/index'
import { matcherHandler } from './utils/utils'
import { validateEnvSafe } from '#/env'
import { toAbsoluteUrl } from '@/lib/utils'

const env = validateEnvSafe(process.env).data

const withAuth: MiddlewareFactory = (next: NextMiddleware) => {
    if (!env) {
        throw new Error('env is not valid')
    }
    return async (request: NextRequest, _next: NextFetchEvent) => {
        const res = await auth(async function middleware(req) {
            const toNext = async () => (await next(req as any, _next))!
            const isAuth = !!req.auth

            if (isAuth) {
                const matcher = matcherHandler(req.nextUrl.pathname, [
                    {
                        and: ['/showcase', '/me/customer'],
                    },
                    () => {
                        // in this route we can check if the user is authenticated with the customer role
                        // if (session?.role === 'customer') {
                        //     return toNext()
                        // }
                        // return NextResponse.redirect(
                        //     process.env.NEXT_PUBLIC_APP_URL!.replace(/\/$/, '') +
                        //         (pages?.signIn ||
                        //             process.env.NEXT_PUBLIC_SIGNIN_PATH ||
                        //             '/auth/login') +
                        //         '?' +
                        //         encodeURIComponent(
                        //             'callbackUrl=' +
                        //                 req.nextUrl.pathname +
                        //                 (req.nextUrl.search ?? '')
                        //         )
                        // )
                    },
                ])
                if (matcher.hit) {
                    return matcher.data // return the Response associated
                }
                return toNext() // call the next middleware because the route is good
            } else {
                // this else is hit when the user is not authenticated and on the routes listed on the export matcher
                return NextResponse.redirect(
                    toAbsoluteUrl(
                        (pages?.signIn ||
                            env?.NEXT_PUBLIC_SIGNIN_PATH ||
                            '/auth/login') +
                            '?callbackUrl=' +
                            encodeURIComponent(
                                req.nextUrl.pathname +
                                    (req.nextUrl.search ?? '')
                            )
                    )
                ) // not authenticated, redirect to login
            }
        })(request as unknown as any, _next as any)
        if (res) {
            return new NextResponse(res.body, {
                url: res.url,
                status: res.status,
                statusText: res.statusText,
                headers: res.headers,
            }) // convert to NextResponse
        }
        return NextResponse.next()
    }
}

export default withAuth

export const matcher: Matcher = [
    {
        and: [
            nextauthNoApi,
            nextjsRegexpPageOnly,
            { or: ['/showcase', '/dashboard', '/settings', '/profile'] },
        ],
    },
]

export const config: ConfigFactory = {
    name: 'withAuth',
    matcher: true,
}
