import { NextAuthOptions, Awaitable, User, Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { handleError } from '../utils'
import { readMe, refresh, withToken } from '@repo/directus-sdk'
import { JWT } from 'next-auth/jwt'
import { AuthRefresh, UserSession, UserParams } from '@/types/next-auth'
import { validateEnvSafe } from '#/env'
import { createDirectusEdgeWithDefaultUrl } from '../directus/directus-edge'

const userParams = (user: UserSession): UserParams => {
    return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        name: `${user.first_name} ${user.last_name}`,
    }
}

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'Enter your email',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                    placeholder: 'Enter your password',
                },
            },
            authorize: async function (credentials) {
                try {
                    const { email, password } = credentials as {
                        email: string
                        password: string
                    }
                    const directus = createDirectusEdgeWithDefaultUrl()
                    console.log('login: Logging in')
                    const auth = await directus.login(email, password, {
                        mode: 'json',
                    })

                    console.log('login: Auth:', auth)
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
                    console.log('login: LoggedInUser:', loggedInUser)
                    const user: Awaitable<User> = {
                        id: loggedInUser.id,
                        first_name: loggedInUser.first_name ?? '',
                        last_name: loggedInUser.last_name ?? '',
                        email: loggedInUser.email ?? '',
                        access_token: auth.access_token ?? '',
                        expires: Math.floor(Date.now() + (auth.expires ?? 0)),
                        refresh_token: auth.refresh_token ?? '',
                    }
                    console.log('login: User:', user)
                    return user
                } catch (error: any) {
                    return handleError(
                        typeof error === 'string'
                            ? error
                            : JSON.stringify(error)
                    )
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    secret: validateEnvSafe(process.env as any).data?.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account, user, trigger, session }): Promise<JWT> {
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
                    user: userParams(user),
                    error: null,
                }
            } else if (Date.now() < (token.expires_at ?? 0)) {
                return { ...token, error: null }
            } else {
                try {
                    const directus = createDirectusEdgeWithDefaultUrl()
                    console.log('refreshToken: Refreshing token')
                    console.log('refreshToken: User:', user)
                    console.log('refreshToken: Token:', token)
                    const result: AuthRefresh = await directus.request(
                        refresh(
                            'json',
                            user?.refresh_token ?? token?.refresh_token ?? ''
                        )
                    )
                    console.log('refreshToken: result', result)
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
                    console.log(resultToken)
                    return resultToken
                } catch (error) {
                    console.error(error)
                    return handleError(
                        typeof error === 'string'
                            ? error
                            : 'RefreshAccessTokenError'
                    )
                }
            }
        },
        async session({ session, token }): Promise<Session> {
            if (token.error) {
                session.error = token.error
                session.expires = new Date(
                    new Date().setDate(new Date().getDate() - 1)
                ).toISOString()
            } else {
                const { id, name, email } = token.user as UserParams
                session.user = { id, name, email }
                session.access_token = token.access_token
                session.tokenIsRefreshed = token?.tokenIsRefreshed ?? false
                session.expires_at = token.expires_at
                session.refresh_token = token.refresh_token
            }
            return session
        },
    },
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/logout',
        error: '/auth/error',
    },
}
