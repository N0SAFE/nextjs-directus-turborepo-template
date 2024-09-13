import {
    authentication,
    AuthenticationClient,
    AuthenticationStorage,
    rest,
} from '@repo/directus-sdk'
import { options } from '../auth/options'
import { getSession } from 'next-auth/react'
import { createDefaultDirectusInstance, directusUrl } from './share'
import { useSession } from '@/state/session'
import { Schema } from '@repo/directus-sdk/client'

if ((process.env as any).NEXT_RUNTIME! === 'edge') {
    throw new Error('The module is not compatible with the runtime')
}

class DirectusStore implements AuthenticationStorage {
    async get() {
        if (typeof window === 'undefined') {
            const session = await import('next-auth').then((m) =>
                m.getServerSession(options)
            )
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
        if (useSession.getState().session) {
            const session = useSession.getState().session
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
        } else {
            const session = await getSession()
            useSession.getState().setSession(session)
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
    }
    set() {
        console.log('DirectusStore: set')
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
