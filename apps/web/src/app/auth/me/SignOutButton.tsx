'use client'

import { Button } from '@repo/ui/components/shadcn/button'
import { signOut } from '@/lib/auth/actions'

const SignOutButton: React.FC = () => {
    return (
        <Button
            variant={'destructive'}
            onClick={async () => {
                await signOut()
                window.location.reload()
            }}
        >
            Sign out
        </Button>
    )
}

export default SignOutButton
