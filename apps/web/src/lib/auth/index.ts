// Re-export Better Auth configuration and types
export { auth, type Session, type User } from './better-auth'
export { authClient, signIn, signOut, useSession, getSession } from './client'
export * from './actions'

// Auth pages configuration for Better Auth
export const pages = {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
} as const

// Better Auth handlers for API routes
export const handlers = {
    GET: auth.handler,
    POST: auth.handler,
}
