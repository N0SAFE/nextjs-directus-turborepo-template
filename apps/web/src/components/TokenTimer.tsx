'use client'

import directus from '@/lib/directus'
import { Card, CardContent } from '@repo/ui/components/shadcn/card'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useEffect, useReducer, useState } from 'react'

export function TokenTimer() {
    const { data } = useSession()
    const { expires_at } = data || {}
    const expiresAt = new Date(expires_at!)
    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    const [retry, setRetry] = useState(0)

    const { data: meData } = useQuery({
        queryKey: ['me', retry],
        queryFn: async () => ({
            last: Date.now(),
            me: await directus.DirectusUser.Me.read(),
        }),
    })
    const { me, last } = meData || {}
    const nextRetry = 10 - (Date.now() - last!) / 1000
    const [_, forceReload] = useReducer((x) => x + 1, 0)

    useEffect(() => {
        const meTimer = setInterval(() => {
            setRetry((prev) => prev + 1)
        }, 1000 * 10)
        const timer = setInterval(() => {
            forceReload()
        }, 1000)
        return () => {
            clearInterval(timer)
            clearInterval(meTimer)
        }
    }, [])

    if (!expiresAt || !data) {
        return (
            <Card className="fixed bottom-0 right-0 p-4">
                <CardContent>
                    <span>{!expiresAt ? 'no expiry date' : 'no token'}</span>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="fixed bottom-0 right-0 p-4">
            <CardContent>
                <span>
                    {minutes === 0 && seconds === 0 ? (
                        'Token expired'
                    ) : (
                        <div className="flex flex-col space-y-2">
                            <span>
                                Token expires in: {minutes}:
                                {seconds < 10 ? `0${seconds}` : seconds}
                            </span>
                            <span>
                                next me retry in {nextRetry.toFixed(0)} seconds
                            </span>
                            <span>
                                last me is {me?.id} {me?.email}
                            </span>
                        </div>
                    )}
                </span>
            </CardContent>
        </Card>
    )
}
