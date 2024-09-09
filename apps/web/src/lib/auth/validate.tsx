'use client'

import { useSession } from '@/state/session'
import { signOut, useSession as us } from 'next-auth/react'
import { useEffect } from 'react'

export default function Validate({ children }: React.PropsWithChildren<{}>) {
    const { data: session, update } = us()
    const setSession = useSession((state) => state.setSession)
    useEffect(() => {
        if (session?.tokenIsRefreshed) {
            update({
                ...session,
                tokenIsRefreshed: false,
            })
            setSession({
                ...session,
                tokenIsRefreshed: false,
            })
            return
        }
        if (session?.error && session.error === 'RefreshAccessTokenError') {
            signOut()
            setSession(null)
            return
        }
        setSession(session)
    }, [session, update, setSession])

    return children
}
