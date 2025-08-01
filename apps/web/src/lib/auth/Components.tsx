'use client'

import { PropsWithChildren } from 'react'
import { Session, User } from './index'
import { Authlogin } from '@/routes/index'
import { Button } from '@repo/ui/components/shadcn/button'
import { signOut } from './client'
import { usePathname, useSearchParams } from 'next/navigation'
import { toAbsoluteUrl } from '../utils'
import { useSession } from './client'

export function IsSignedIn({
    children,
    validator,
}: PropsWithChildren<{
    validator?: (session: Session) => boolean
}>) {
    const { data: session } = useSession()
    if (session && (validator ? validator(session) : true)) {
        return <>{children}</>
    }
    return null
}

export function IsSignedOut({
    children,
}: React.PropsWithChildren<object>) {
    const { data: session } = useSession()
    if (!session) {
        return <>{children}</>
    }
    return null
}

export function LoginLink(
    props: React.ComponentProps<typeof Authlogin.Link>
) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const callbackUrl = toAbsoluteUrl(`/${pathname}?${searchParams.toString()}`)

    return (
        <Authlogin.Link {...props} search={{ callbackUrl, ...props.search }} />
    )
}

export function LogoutButton(props: React.ComponentProps<typeof Button>) {
    return (
        <Button
            onClick={async (e) => {
                await signOut()
                props.onClick?.(e)
            }}
            {...props}
        />
    )
}
