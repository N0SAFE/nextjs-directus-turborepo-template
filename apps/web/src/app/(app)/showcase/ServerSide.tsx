import directus from '@/lib/directus'
import { readUsers } from '@directus/sdk'
import React from 'react'
import ListItemShowcase from './ListItem'
import { Collections } from '@repo/directus-sdk/client'

const ServerSideShowcase: React.FC = async function ServerSideShowcase () {
    const users = (await directus.request(
        readUsers()
    )) as Collections.DirectusUser[]

    return <ListItemShowcase users={users} />
}

export default ServerSideShowcase
