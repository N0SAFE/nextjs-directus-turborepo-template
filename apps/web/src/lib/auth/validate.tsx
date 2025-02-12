'use client'

import {
    setSession as setZustandSession,
    subscribeToUserSession as subscribeToZustandUserSession,
    getSession as getZustandSession,
} from '@/state/session'
import { getSession, signOut, useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'

export default function Validate({ children }: React.PropsWithChildren<{}>) {
    const { data: session, update } = useSession()
    const isRefreshing = useRef(false)

    console.log('ui')

    // Handle zustand session updates
    useEffect(() => {
        const unsubscribe = subscribeToZustandUserSession((state) => {
            if (
                state.session &&
                !isRefreshing.current &&
                session !== state.session
            ) {
                if (process.env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                    console.log(
                        'Validate: updating session from zustand',
                        state.session
                    )
                }
                update(state.session)
            }
        })
        return () => unsubscribe()
    }, [update, session])

    // Handle session updates and errors
    useEffect(() => {
        if (!session) return
        if (session.error === 'RefreshAccessTokenError') {
            if (process.env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                console.log('Validate: signOut due to refresh error')
            }
            signOut()
            setZustandSession(null)
            return
        }

        if (session !== getZustandSession()) {
            if (process.env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                console.log('Validate: syncing session to zustand', session)
            }
            setZustandSession(session)
        }
    }, [session, update])

    // Handle token refresh timing
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
            console.log({
                expires_at: session?.expires_at,
                isRefreshing: isRefreshing.current,
            })
        }
        if (!session?.expires_at || isRefreshing.current) return

        const expiryTime = new Date(session.expires_at).getTime()
        const currentTime = Date.now()
        const timeUntilExpiry = expiryTime - currentTime

        // Refresh at 90% of the token's lifetime
        const refreshDelay = timeUntilExpiry * 0.9
        const MIN_TIME = 1000
        const MAX_TIME = 1000 * 60 * 5
        const timeToRefresh = Math.min(
            Math.max(refreshDelay, MIN_TIME),
            MAX_TIME
        )

        if (process.env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
            console.log('TokenTimer: scheduled refresh in:', timeToRefresh, {
                expiryTime,
                currentTime,
                timeUntilExpiry,
            })
        }

        const timer = setTimeout(async () => {
            if (!isRefreshing.current) {
                isRefreshing.current = true
                if (process.env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                    console.log('TokenTimer: refreshing token')
                }
                const newSession = await getSession()
                if (newSession) {
                    update({
                        ...newSession,
                        tokenIsRefreshed: true,
                    })
                    setZustandSession(newSession)
                }
                isRefreshing.current = false
            }
        }, timeToRefresh)

        return () => {
            clearTimeout(timer)
        }
    }, [session?.expires_at, update])

    return children
}
