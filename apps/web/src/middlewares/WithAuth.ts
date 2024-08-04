import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse,
} from 'next/server'
import {
    ConfigFactory,
    Matcher,
    MatcherTypeArray,
    MiddlewareFactory,
} from './utils/types'
import { NextRequestWithAuth, withAuth as w } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'
import { options } from '@/lib/auth/options'
import { nextauthNoApi, nextjsRegexpPageOnly } from './utils/static'
import { validateEnv } from '#/env'

const withAuth: MiddlewareFactory = (next: NextMiddleware) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        return w(
            async function middleware(req) {
                const env = validateEnv(process.env)
                const token = await getToken({ req })
                const isAuth = !!token

                console.log(isAuth)

                if (isAuth) {
                    const resSession = await fetch(
                        env.NEXTAUTH_URL + '/api/auth/session',
                        {
                            method: 'GET',
                            headers: {
                                'Content-type': 'application/json',
                                Cookie: req.headers.get('cookie')! ?? undefined,
                            },
                        }
                    )
                    const me = await resSession.json()
                    // const requestForNextAuth = {
                    //   ...req,
                    //   headers: {
                    //     ...Object.fromEntries(req.headers),
                    //   },
                    // };
                    // const me = await getSession({ req: requestForNextAuth }).then(
                    //   (s) => s?.user,
                    // );
                    if (req.nextUrl.pathname.match(new RegExp('/showcase'))) {
                        me // TODO: auth by role
                    }
                } else {
                    return NextResponse.redirect(
                        options.pages?.signIn ??
                            ('/auth/login' as string) +
                                encodeURIComponent(
                                    '?callbackUrl=' +
                                        req.nextUrl.pathname +
                                        (req.nextUrl.search ?? '')
                                )
                    )
                }

                const res = next(req, _next)
                return res
            },
            {
                callbacks: {
                    async authorized({ token }) {
                        return !!token
                    },
                },
                pages: options.pages,
            }
        )(request as NextRequestWithAuth, _next)
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
