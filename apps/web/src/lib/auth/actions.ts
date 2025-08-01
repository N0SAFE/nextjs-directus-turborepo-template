'use server'

import { revalidatePath } from 'next/cache'
import { authClient } from './client'

export async function signIn(email: string, password: string, redirectTo?: string) {
    try {
        const result = await authClient.signIn.email({
            email,
            password,
        })
        revalidatePath('/', 'layout')
        if (redirectTo) {
            // Handle redirect in the calling component
        }
        return result
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Authentication failed' }
    }
}

export async function signOut(redirectTo?: string) {
    try {
        const result = await authClient.signOut()
        revalidatePath('/', 'layout')
        if (redirectTo) {
            // Handle redirect in the calling component
        }
        return result
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Sign out failed' }
    }
}
