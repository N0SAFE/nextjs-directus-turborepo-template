import directus from '@/lib/directus'
import React from 'react'
import ListItemShowcase from './ListItem'

const ServerSideShowcase: React.FC = async function ServerSideShowcase() {
    const users = await directus.DirectusUsers.query({
        fields: ['id', 'status'],
    })

    return <ListItemShowcase users={users} />
}

export default ServerSideShowcase
