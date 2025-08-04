import { createORPCClient, onError } from '@orpc/client';
import { type AppContract, appContract } from '@repo/api-contracts';
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import { ContractRouterClient } from '@orpc/contract'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'

// Get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const link = new OpenAPILink(appContract, {
  url: `${API_URL}`,
  headers: () => ({
    authorization: 'Bearer token',
  }),
  interceptors: [
    onError((error) => {
      console.error(error)
    })
  ],
})

// Create the base ORPC client
export const orpcServer = createORPCClient<ContractRouterClient<AppContract>>(link);

// Create the TanStack Query utils for React components
export const orpc = createTanstackQueryUtils(orpcServer);

export type ORPCClient = typeof orpc;