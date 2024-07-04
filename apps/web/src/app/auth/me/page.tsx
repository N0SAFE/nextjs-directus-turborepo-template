import directus from '@/lib/directus'
import { Authlogin } from '@/routes/index'
import { readMe } from '@directus/sdk'
import { Button } from '@repo/ui/components/shadcn/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@repo/ui/components/shadcn/card'
import { getServerSession } from 'next-auth'
import { headers } from 'next/headers'
import React from 'react'
import SignOutButton from './SignOutButton'
import { options } from '@/lib/auth/options'

export default async function MePage() {
    const nextauthSession = await getServerSession(options)
    const directusMe = await directus.request(readMe()).catch(() => null)
    const headersList = headers()
    const url = headersList.get('x-pathname')

    if (!url) {
        throw new Error('No x-pathname header found')
    }

    return (
        <div className="flex h-full w-full items-center justify-center">
            <Card className="w-fit min-w-[450px]">
                <CardHeader>
                    <CardTitle>Profiles</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 lg:flex-row">
                    <Card className="w-full min-w-[380px]">
                        <CardHeader>
                            <CardTitle>My nextauth Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                <strong>Status:</strong>{' '}
                                {nextauthSession
                                    ? 'authenticated'
                                    : 'unauthenticated'}
                            </p>
                            <p>
                                <strong>Name:</strong>{' '}
                                {nextauthSession?.user?.name || 'Unknown'}
                            </p>
                            <p>
                                <strong>Email:</strong>{' '}
                                {nextauthSession?.user?.email || 'Unknown'}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="w-full min-w-[380px]">
                        <CardHeader>
                            <CardTitle>My directus Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                <strong>Status:</strong>{' '}
                                {directusMe
                                    ? 'authenticated'
                                    : 'unauthenticated'}
                            </p>
                            <p>
                                <strong>Name:</strong>{' '}
                                {`${directusMe?.first_name} ${directusMe?.last_name}` ||
                                    'Unknown'}
                            </p>
                            <p>
                                <strong>Email:</strong>{' '}
                                {directusMe?.email || 'Unknown'}
                            </p>
                        </CardContent>
                    </Card>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <SignOutButton />
                    <Authlogin.Link search={{ callbackUrl: url }}>
                        <Button>Go to login</Button>{' '}
                    </Authlogin.Link>
                </CardFooter>
            </Card>
        </div>
    )
}
