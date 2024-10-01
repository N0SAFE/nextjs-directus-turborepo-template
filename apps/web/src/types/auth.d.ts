import { type DefaultSession } from 'next-auth'

declare module 'next-auth' {
    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     */
    interface User {
        id: string
        email: string
        first_name: string
        last_name: string
        access_token: string
        expires: number
        refresh_token: string
    }
    /**
     * The shape of the account object returned in the OAuth providers' `account` callback,
     * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
     */
    // interface Account {}

    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: { id?: StringConstructor } & DefaultSession['user']
        access_token?: string
        expires_at?: number
        refresh_token?: string
        tokenIsRefreshed: boolean | null
        error?: string | null
    }
}

declare module 'next-auth/jwt' {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
        access_token?: string
        expires_at?: number
        refresh_token?: string
        error?: string | null
        tokenIsRefreshed?: boolean | null
    }
}

export type AuthRefresh = {
    access_token?: string | null
    expires?: number | null
    refresh_token?: string | null
}

export type UserSession = {
    id: string
    first_name: string
    last_name: string
    email: string
    access_token?: string
    expires?: number
    refresh_token?: string
}

export type UserParams = {
    id?: string
    name?: string
    first_name?: string
    last_name?: string
    email?: string
}

export type UserAuthenticated = {
    id?: string
    name?: string
    email?: string
}
