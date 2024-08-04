import React from 'react'

import ClientSideShowcase from '../ClientSide'

const ShowcaseClientPage: React.FC = async function ShowcasePage () {
    // console.log(await directus.getToken());
    return (
        <div className="h-full w-full">
            <h1>client side</h1>
            <ClientSideShowcase />
        </div>
    )
}

export default ShowcaseClientPage
