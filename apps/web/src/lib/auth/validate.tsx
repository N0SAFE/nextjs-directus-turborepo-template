'use client'

import {
    setSession as setZustandSession,
    subscribeToUserSession as subscribeToZustandUserSession,
    getSession as getZustandSession,
} from '@/state/session'
import { useSession } from './client'
import { useEffect, useRef } from 'react'
import { createDirectusEdgeWithDefaultUrl } from '../directus/directus-edge'
import { refresh } from '@directus/sdk'

export default function Validate({
    children,
}: React.PropsWithChildren<object>) {
    const { data: session, error } = useSession()
    const isRefreshing = useRef(false)

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
                        'Better Auth Validate: updating session from zustand',
                        state.session
                    )
                }
                // Better Auth handles session updates differently
                // We might need to trigger a re-fetch here
            }
        })
        return () => unsubscribe()
    }, [session])

    // Handle session updates and errors
    useEffect(() => {
        if (!session) {
            setZustandSession(null)
            return
        }

        if (session !== getZustandSession()) {
            if (process.env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                console.log('Better Auth Validate: syncing session to zustand', session)
            }
            setZustandSession(session)
        }
    }, [session])

    // Handle token refresh timing for Directus tokens
    useEffect(() => {
        if (!session?.user?.directusTokenExpires || isRefreshing.current) {
            return
        }

        const expiryTime = session.user.directusTokenExpires
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
            console.log('Better Auth TokenTimer: scheduled refresh in:', timeToRefresh, {
                expiryTime,
                currentTime,
                timeUntilExpiry,
            })
        }

        const timer = setTimeout(async () => {
            if (!isRefreshing.current && session.user?.directusRefreshToken) {
                isRefreshing.current = true
                if (process.env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                    console.log('Better Auth TokenTimer: refreshing Directus token')
                }
                
                try {
                    const directus = createDirectusEdgeWithDefaultUrl()
                    const refreshResult = await directus.request(
                        refresh('json', session.user.directusRefreshToken)
                    )
                    
                    // Update the session with new tokens
                    // This would need to be implemented with Better Auth's session update mechanism
                    if (process.env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                        console.log('Better Auth TokenTimer: token refreshed successfully')
                    }
                } catch (error) {
                    if (process.env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
                        console.error('Better Auth TokenTimer: token refresh failed', error)
                    }
                }
                
                isRefreshing.current = false
            }
        }, timeToRefresh)

        return () => {
            clearTimeout(timer)
        }
    }, [session?.user?.directusTokenExpires, session?.user?.directusRefreshToken])

    return <>{children}</>
}
