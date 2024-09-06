import { authentication, AuthenticationStorage, rest } from '@repo/directus-sdk'
import { options } from '../auth/options'
import { getSession } from 'next-auth/react'
import { createDefaultDirectusInstance, directusUrl } from './share'
import { asyncLock } from '../asyncLock'

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
        if (localStorage.getItem('directus_session')) {
            return JSON.parse(localStorage.getItem('directus_session')!)
        } else {
            const session = await asyncLock.acquire('getSession', getSession)
            localStorage.setItem('directus_session', JSON.stringify(session))
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

export const createDirectusInstance = (url: string) => {
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

export const createDirectusWithDefaultUrl = () => {
    return createDirectusInstance(directusUrl!)
}

const directus = createDirectusWithDefaultUrl()

export default directus
