import {
    authentication,
    AuthenticationClient,
    AuthenticationStorage,
    rest,
} from '@repo/directus-sdk'
import { getSession } from 'next-auth/react'
import { createDefaultDirectusInstance, directusUrl } from './share'
import {
    getSession as getZustandSession,
    setSession as setZustandSession,
} from '@/state/session'
import { Schema } from '@repo/directus-sdk/client'
import { auth } from '../auth/index'

if ((process.env as any).NEXT_RUNTIME! === 'edge') {
    throw new Error('The module is not compatible with the runtime')
}

class DirectusStore implements AuthenticationStorage {
    async get() {
        if (process.env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
            console.log('DirectusStore: get')
        }
        if (typeof window === 'undefined') {
            const session = await auth()
            return (
                session && {
                    access_token: session.access_token ?? null,
                    refresh_token: session.refresh_token ?? null,
                    expires: session.expires_at
                        ? new Date(session.expires_at).getTime() - Date.now()
                        : null,
                    expires_at: session.expires_at ?? null,
                }
            )
        }
        if (getZustandSession()) {
            const session = getZustandSession()
            // check if the session.expires_at is not expired
            if (
                session?.expires_at &&
                new Date(session.expires_at).getTime() > Date.now()
            ) {
                return (
                    session && {
                        access_token: session.access_token ?? null,
                        refresh_token: session.refresh_token ?? null,
                        expires: session.expires_at
                            ? new Date(session.expires_at).getTime() -
                              Date.now()
                            : null,
                        expires_at: session.expires_at ?? null,
                    }
                )
            }
            // else let the default session management works (with auth.js that refetch a new session if he can get one with the refresh token)
        }

        const session = await getSession()
        setZustandSession(session)
        return (
            session && {
                access_token: session.access_token ?? null,
                refresh_token: session.refresh_token ?? null,
                expires: session.expires_at
                    ? new Date(session.expires_at).getTime() - Date.now()
                    : null,
                expires_at: session.expires_at ?? null,
            }
        )
    }
    set() {
        if (process.env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
            console.log('DirectusStore: set')
        }
    }
}

const directusStore = new DirectusStore()

export const createDirectusInstance = (
    url: string
): ReturnType<typeof createDefaultDirectusInstance> &
    AuthenticationClient<Schema> => {
    const directusInstance = createDefaultDirectusInstance(url).with(
        rest({
            credentials: 'include',
            onRequest: (options) => ({ ...options, cache: 'no-store' }),
        })
    )
    const enhanceDirectusInstance = directusInstance.with(
        authentication('json', {
            credentials: 'include',
            autoRefresh: false,
            msRefreshBeforeExpires: 0,
            storage: directusStore,
        })
    )
    enhanceDirectusInstance.stopRefreshing()
    return enhanceDirectusInstance
}

export const createDirectusWithDefaultUrl = (): ReturnType<
    typeof createDirectusInstance
> => {
    return createDirectusInstance(directusUrl!)
}

const directus: ReturnType<typeof createDirectusWithDefaultUrl> =
    createDirectusWithDefaultUrl()

export default directus
