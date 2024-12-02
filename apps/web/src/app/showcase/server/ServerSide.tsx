import directus from '@/lib/directus'
import React from 'react'
import ListItemShowcase from '../ListItem'

const ServerSideShowcase: React.FC = async function ServerSideShowcase() {
    const startTime = Date.now()
    const users = await directus.DirectusUsers.query({
        fields: ['id', 'status'],
    })

    const endTime = Date.now()

    return (
        <>
            <div>Time taken: {endTime - startTime}ms</div>
            <ListItemShowcase users={users} />
        </>
    )
}

export default ServerSideShowcase
