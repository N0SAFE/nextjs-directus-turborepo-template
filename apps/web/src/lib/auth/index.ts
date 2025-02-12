import NextAuth, { User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { handleError } from '../utils'
import { AuthenticationData, readMe, withToken } from '@repo/directus-sdk'
import { JWT } from 'next-auth/jwt'
import { UserSession, UserParams } from '@/types/auth'
import { createDirectusEdgeWithDefaultUrl } from '../directus/directus-edge'
import { memoize } from '@/lib/better-unstable-cache'
import { validateEnv } from '#/env'
import { Session, NextAuthResult } from 'next-auth'

export const pages = {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
} as const

const userParams = (user: UserSession): UserParams => {
    return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        name: `${user.first_name} ${user.last_name}`,
    }
}

const getCachedRefreshToken = memoize(
    (
        directus: ReturnType<typeof createDirectusEdgeWithDefaultUrl>,
        refresh_token: string
    ) =>
        fetch(
            validateEnv(process.env).NEXT_PUBLIC_APP_URL +
                '/api/auth/refresh_token',
            {
                method: 'POST',
                body: JSON.stringify({ refresh_token }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        ).then((res) => res.json()) as Promise<AuthenticationData>,
    {
        persist: true,
        duration: 3600,
        revalidateTags: (_directus, refresh_token) => [
            `refreshToken:${refresh_token}`,
        ],
        log: ['dedupe', 'datacache', 'verbose'],
    }
)

const result = NextAuth({
    trustHost: true,
    session: {
        strategy: 'jwt',
    },
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'Email',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                    placeholder: 'Password',
                },
            },
            authorize: async (credentials) => {
                const env = validateEnv(process.env)

                if (env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                    console.log('authorize')
                }

                try {
                    const { email, password } = credentials as {
                        email: string
                        password: string
                    }
                    const directus = createDirectusEdgeWithDefaultUrl()
                    if (env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                        console.log('login: Logging in as :', email)
                    }
                    const auth = await directus.login(email, password, {
                        mode: 'json',
                    })

                    if (env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                        console.log('login: Auth:', auth)
                    }
                    const loggedInUser = await directus.request(
                        withToken(
                            auth.access_token ?? '',
                            readMe({
                                fields: [
                                    'id',
                                    'email',
                                    'first_name',
                                    'last_name',
                                ],
                            })
                        )
                    )
                    if (env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                        console.log('login: LoggedInUser:', loggedInUser)
                    }
                    const user: User = {
                        id: loggedInUser.id,
                        first_name: loggedInUser.first_name ?? '',
                        last_name: loggedInUser.last_name ?? '',
                        email: loggedInUser.email ?? '',
                        access_token: auth.access_token ?? '',
                        expires: Math.floor(Date.now() + (auth.expires ?? 0)),
                        refresh_token: auth.refresh_token ?? '',
                    }
                    return user
                } catch (error: any) {
                    return null
                }
            },
        }),
    ],
    callbacks: {
        async jwt({
            token,
            account,
            user,
            trigger,
            session,
        }): Promise<JWT | null> {
            const env = validateEnv(process.env)

            try {
                if (env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                    console.log('callback: jwt')
                    console.log({
                        token,
                        account,
                        user,
                        trigger,
                        session,
                    })
                }
                if (trigger === 'update' && !session?.tokenIsRefreshed) {
                    token.access_token = session.access_token
                    token.refresh_token = session.refresh_token
                    token.expires_at = session.expires_at
                    token.tokenIsRefreshed = false
                }

                if (account) {
                    return {
                        access_token: user.access_token,
                        expires_at: user.expires,
                        refresh_token: user.refresh_token,
                        user: userParams(user as any),
                        error: null,
                    }
                } else if (Date.now() < (token.expires_at ?? 0)) {
                    return { ...token, error: null }
                } else {
                    if (!(user?.refresh_token ?? token?.refresh_token)) {
                        return handleError(
                            'RefreshTokenMissing',
                            'No refresh token'
                        )
                    }
                    try {
                        const directus = createDirectusEdgeWithDefaultUrl()
                        if (env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                            console.log('refreshToken: Refreshing token')
                            console.log('refreshToken: User:', user)
                            console.log('refreshToken: Token:', token)
                            console.log(
                                'refresh using token :',
                                user?.refresh_token ?? token?.refresh_token
                            )
                        }
                        const result = await getCachedRefreshToken(
                            directus,
                            user?.refresh_token ?? token?.refresh_token
                        )
                        if (env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                            console.log('refreshToken: result', result)
                        }
                        const resultToken = {
                            ...token,
                            access_token: result.access_token ?? '',
                            expires_at: Math.floor(
                                Date.now() + (result.expires ?? 0)
                            ),
                            refresh_token: result.refresh_token ?? '',
                            error: null,
                            tokenIsRefreshed: true,
                        }
                        return resultToken
                    } catch (error: any) {
                        return handleError(
                            typeof error === 'string'
                                ? error
                                : 'RefreshAccessTokenError',
                            error
                        )
                    }
                }
            } catch (error: any) {
                if (env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                    console.error('jwt error:', error)
                }
                return null
            }
        },
        async session({ session, token, user }): Promise<Session> {
            const env = validateEnv(process.env)

            if (env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                console.log('callback: session')
            }
            if (token.error) {
                session.error = token.error
                session.expires = new Date(
                    new Date().setDate(new Date().getDate() - 1)
                ).toISOString() as Date & string
            } else {
                const { id, name } = token.user as UserParams
                session.user = {
                    name,
                    ...user,
                    id: id as StringConstructor & string,
                }
                session.access_token = token.access_token
                session.tokenIsRefreshed = token?.tokenIsRefreshed ?? false
                session.expires_at = token.expires_at
                session.refresh_token = token.refresh_token
            }
            return session
        },
    },
    pages,
})

export const { handlers, signIn: _, signOut: __ } = result
export const auth = result.auth as NextAuthResult['auth']
