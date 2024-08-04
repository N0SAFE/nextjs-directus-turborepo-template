import { Collections } from '@repo/directus-sdk/client'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@repo/ui/components/shadcn/card'
import React from 'react'

type ListItemShowcaseProps = {
    users?: Collections.DirectusUser[]
}

const ListItemShowcase: React.FC<ListItemShowcaseProps> = function ListItemShowcase({ users }) {
    return (
        <div className="flex flex-col gap-4">
            {users?.map((user) => (
                <Card key={user.id}>
                    <CardHeader>
                        <CardTitle>ID: {user.id}</CardTitle>
                    </CardHeader>
                    <CardContent>status {user.status}</CardContent>
                </Card>
            ))}
        </div>
    )
}

export default ListItemShowcase
