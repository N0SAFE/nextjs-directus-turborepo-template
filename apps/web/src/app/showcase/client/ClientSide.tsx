'use client'

import directus from '@/lib/directus'
import React, { Suspense } from 'react'
import ListItemShowcase from '../ListItem'
import { Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

const ClientSideShowcase: React.FC = function ClientSideShowcase() {
    const [timeTaken, setTimeTaken] = React.useState<number | null>(null)
    const startTime = React.useMemo(() => Date.now(), [])
    const { data: users, isFetched } = useQuery({
        queryKey: ['users'],
        queryFn: () => directus.DirectusUsers.query(),
    })

    React.useEffect(() => {
        if (isFetched && !timeTaken) {
            const endTime = Date.now()
            setTimeTaken(endTime - startTime)
        }
    }, [isFetched])

    return (
        <Suspense
            fallback={
                <div className="flex h-full w-full items-center justify-center">
                    <Loader2 className="animate-spin" />
                </div>
            }
        >
            <div className="mb-4 flex items-center justify-between">
                <p>first load</p>
                <div>Time taken: {timeTaken}ms</div>
            </div>

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
