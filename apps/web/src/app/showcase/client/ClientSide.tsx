'use client'

import directus from '@/lib/directus'
import React, { Suspense } from 'react'
import ListItemShowcase from '../ListItem'
import { Loader2 } from 'lucide-react'
import { toUseQuery } from '@/lib/utils'

const ClientSideShowcase: React.FC = function ClientSideShowcase() {
    const [timeTaken, setTimeTaken] = React.useState<number | null>(null)
    const startTime = React.useMemo(() => Date.now(), [])
    const useDirectusUsersQuery = toUseQuery(
        directus.DirectusUsers.query.bind(directus.DirectusUsers)
    ) // or toUseQuery(() => directus.DirectusUsers.query())
    const { data: users, isFetched } = useDirectusUsersQuery({
        queryKey: ['example1'],
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
            <p>first load</p>
            <div>Time taken: {timeTaken}ms</div>
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
