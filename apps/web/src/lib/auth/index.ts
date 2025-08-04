import { auth } from '@repo/auth'

// Re-export Better Auth configuration and types
export { auth } from '@repo/auth'
export {
    authClient,
    signIn,
    signOut,
    signUp,
    useSession,
    getSession,
    $store,
    $fetch,
    $ERROR_CODES,
    $Infer,
} from './client'
export * from './actions'

// Auth pages configuration for Better Auth
export const pages = {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
} as const

// Better Auth handlers for API routes
export const handlers = auth.handler
