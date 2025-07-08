import { Collections } from '@repo/directus-sdk/client'
import { ApplyFields } from '@repo/directus-sdk/utils'
import {
    Card,
    CardContent,
} from '@repo/ui/components/shadcn/card'
import { User, CheckCircle, XCircle, Clock } from 'lucide-react'
import React from 'react'

type ListItemShowcaseProps = {
    users?: ApplyFields<Collections.DirectusUser, ['id', 'status']>[]
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'active':
            return <CheckCircle className="h-4 w-4 text-green-500" />
        case 'inactive':
            return <XCircle className="h-4 w-4 text-red-500" />
        case 'pending':
            return <Clock className="h-4 w-4 text-yellow-500" />
        default:
            return <User className="h-4 w-4 text-gray-500" />
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        case 'inactive':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
}

const ListItemShowcase: React.FC<ListItemShowcaseProps> =
    function ListItemShowcase({ users }) {
        if (!users || users.length === 0) {
            return (
                <div className="text-center py-8">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">No Users Found</h3>
                    <p className="text-sm text-muted-foreground">
                        There are no users to display at the moment.
                    </p>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Directus Users ({users.length})</h3>
                    <span className="text-sm text-muted-foreground">
                        Showing {users.length} user{users.length !== 1 ? 's' : ''}
                    </span>
                </div>
                <div className="grid gap-3">
                    {users.map((user) => (
                        <Card key={user.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 rounded-lg bg-muted">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium">User #{user.id}</div>
                                            <div className="text-sm text-muted-foreground">
                                                Directus User Account
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(user.status)}
                                        <span className={`px-2 py-1 text-xs rounded-md ${getStatusColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

export default ListItemShowcase
