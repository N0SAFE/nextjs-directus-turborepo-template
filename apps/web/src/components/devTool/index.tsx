'use client'

import { DevToolProvider } from '@/devtools'
import { authPlugin, examplePlugin } from '@/devtools/plugins'

export const DevTool = () => {
    return <DevToolProvider plugins={[authPlugin, examplePlugin]} />
}
