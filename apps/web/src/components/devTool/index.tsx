'use client'

import { DevToolProvider } from '@/devtools'
import { authPlugin } from '@/devtools/plugins/auth/AuthPlugin'
import { examplePlugin } from '@/devtools/plugins'

// Move plugins array outside component to prevent new reference on every render
const devToolPlugins = [authPlugin, examplePlugin]

export const DevTool = () => {
    return <DevToolProvider plugins={devToolPlugins} />
}
