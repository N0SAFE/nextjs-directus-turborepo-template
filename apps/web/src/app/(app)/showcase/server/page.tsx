import React from 'react'

import ServerSideShowcase from '../ServerSide'

const ShowcaseServerPage: React.FC = async function ShowcaseServerPage () {
    // console.log(await directus.getToken());
    return (
        <div className="h-full w-full">
            <h1>server side</h1>
            <ServerSideShowcase />
        </div>
    )
}

export default ShowcaseServerPage
