'use client'

import directus from '@/lib/directus'
import { readUsers } from '@directus/sdk'
import React, { Suspense } from 'react'
import ListItemShowcase from './ListItem'
import { useQuery } from '@tanstack/react-query'
import Loader from '@repo/ui/components/atomics/atoms/Loader'
import { Collections } from '@repo/directus-sdk/client'

const ClientSideShowcase: React.FC = () => {
    const { data: users } = useQuery({
        queryKey: ['example'],
        queryFn: async () => {
            return (await directus.request(
                readUsers()
            )) as Collections.DirectusUser[]
        },
    })

    return (
        <Suspense
            fallback={
                <div className="flex h-full w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <ListItemShowcase users={users} />
        </Suspense>
    )
}

export default ClientSideShowcase
