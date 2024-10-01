'use client'

import { Button } from '@repo/ui/components/shadcn/button'
import { logout } from './action'

const SignOutButton: React.FC = () => {
    return (
        <Button
            variant={'destructive'}
            onClick={async () => {
                await logout({ redirect: false })
                window.location.reload()
            }}
        >
            Sign out
        </Button>
    )
}

export default SignOutButton
