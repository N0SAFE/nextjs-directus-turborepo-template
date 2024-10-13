'use client'

import { PropsWithChildren } from 'react'
import { auth } from './index'
import { Session } from 'next-auth'
import { Authlogin } from '@/routes/index'
import { Button } from '@repo/ui/components/shadcn/button'
import { signOut } from './actions'
import { usePathname, useSearchParams } from 'next/navigation'
import { validatePublicEnvSafe } from '#/env'
import { toAbsoluteUrl } from '../utils'

const env = validatePublicEnvSafe(process.env)

export async function IsSignedIn({
    children,
    validator,
}: PropsWithChildren<{
    validator?: (session: Session) => boolean
}>) {
    const session = await auth()
    if (session && (validator ? validator(session) : true)) {
        return <>{children}</>
    }
    return null
}

export async function IsSignedOut({ children }: React.PropsWithChildren<{}>) {
    const session = await auth()
    if (!session) {
        return <>{children}</>
    }
    return null
}

export async function LoginLink(
    props: React.ComponentProps<typeof Authlogin.Link>
) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const callbackUrl = toAbsoluteUrl(`/${pathname}?${searchParams.toString()}`)

    return (
        <Authlogin.Link {...props} search={{ callbackUrl, ...props.search }} />
    )
}

export async function LogoutButton(props: React.ComponentProps<typeof Button>) {
    return (
        <Button
            onClick={(e) => {
                signOut()
                props.onClick?.(e)
            }}
            {...props}
        />
    )
}
