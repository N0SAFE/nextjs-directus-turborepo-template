'use client'

import directus from '@/lib/directus'
import React, { Suspense } from 'react'
import ListItemShowcase from './ListItem'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

const ClientSideShowcase: React.FC = function ClientSideShowcase() {
    const { data: users, isFetched } = useQuery({
        queryKey: ['example'],
        queryFn: async () => {
            console.log('fetching users')
            return await directus.DirectusUsers.query()
        },
        refetchOnWindowFocus: false,
    })

    console.log('users', users)

    return (
        <Suspense
            fallback={
                <div className="flex h-full w-full items-center justify-center">
                    <Loader2 className="animate-spin" />
                </div>
            }
        >
            {!isFetched && (
                <div className="flex h-full w-full items-center justify-center">
                    {' '}
                    <Loader2 className="animate-spin" />{' '}
                </div>
            )}
            <ListItemShowcase users={users} />
        </Suspense>
    )
}

export default ClientSideShowcase
