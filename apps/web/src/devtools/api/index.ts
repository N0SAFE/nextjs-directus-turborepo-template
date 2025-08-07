import { createORPCClient, onError } from '@orpc/client'
import { devtoolsContract } from '../contracts/contract'
import { ContractRouterClient } from '@orpc/contract'
import { validateEnvPath } from '#/env'
import { OpenAPILink } from '@orpc/openapi-client/fetch'

const APP_URL = validateEnvPath(process.env.NEXT_PUBLIC_APP_URL!, 'NEXT_PUBLIC_APP_URL')

const link = new OpenAPILink(devtoolsContract, {
  url: `${APP_URL}/api/devtools`,
  headers: ({context}) => ({
    cookie: context.cookie || '',
  }),
  interceptors: [
    onError((error) => {
      console.error(error)
    })
  ],
})

/**
 * DevTools API client for internal web app communication
 * Uses typed contract for full type safety
 */
export const devToolsApi = createORPCClient<ContractRouterClient<typeof devtoolsContract>>(link)

export type DevToolsApi = typeof devToolsApi