import React from 'react'
import ClientNextAuthProviders from './ClientNextAuthProviders'
import { auth } from '@/lib/auth'

const NextAuthProviders: React.FC<React.PropsWithChildren> = async ({
    children,
}) => {
    const session = await auth()
    return (
        <ClientNextAuthProviders session={session}>
            {children}
        </ClientNextAuthProviders>
    )
}

export default NextAuthProviders
