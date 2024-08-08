'use client'

import directus from '@/lib/directus'
import { readUsers } from '@directus/sdk'
import React, { Suspense } from 'react'
import ListItemShowcase from './ListItem'
import { useQuery } from '@tanstack/react-query'
import { Collections } from '@repo/directus-sdk/client'
import {Loader2} from 'lucide-react'

const ClientSideShowcase: React.FC = function ClientSideShowcase() {
    const { data: users, isFetched } = useQuery({
        queryKey: ['example'],
        queryFn: async () => {
            return (await directus.request(
                readUsers()
            )) as Collections.DirectusUser[]
        },
        refetchOnWindowFocus: false,
        refetchInterval: 2 * 60 * 1000,
    })

    return (
        <Suspense
            fallback={
                <div className="flex h-full w-full items-center justify-center">
                    <Loader2 className="animate-spin" />
                </div>
            }
        >
            {!isFetched && <div className="flex h-full w-full items-center justify-center"> <Loader2 className="animate-spin" /> </div>}
            <ListItemShowcase users={users} />
        </Suspense>
    )
}

export default ClientSideShowcase
