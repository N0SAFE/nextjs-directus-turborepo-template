'use server'

import { revalidatePath } from 'next/cache'
import { authClient } from './client'

export async function signIn(email: string, password: string, redirectTo?: string) {
    const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: redirectTo,
    })
    revalidatePath('/', 'layout')
    return result
}

export async function signOut(redirectTo?: string) {
    const result = await authClient.signOut({
        redirectTo,
    })
    revalidatePath('/', 'layout')
    return result
}
