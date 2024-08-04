import React from 'react'

import { Separator } from '@repo/ui/components/shadcn/separator'
import ServerSideShowcase from './ServerSide'
import ClientSideShowcase from './ClientSide'

const ShowcasePage: React.FC = async function ShowcasePage () {
    // console.log(await directus.getToken());
    return (
        <div className="flex h-full w-full">
            <div className="h-full w-full">
                <h1>server side</h1>
                <ServerSideShowcase />
            </div>
            <Separator orientation="vertical" />
            <div className="h-full w-full">
                <h1>client side</h1>
                <ClientSideShowcase />
            </div>
        </div>
    )
}

export default ShowcasePage
