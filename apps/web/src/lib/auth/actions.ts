'use server'

import { revalidatePath } from 'next/cache'
import { signIn as betterSignIn, signOut as betterSignOut } from './client'

export async function signIn(email: string, password: string, redirectTo?: string) {
    const result = await betterSignIn.email({
        email,
        password,
        callbackURL: redirectTo,
    })
    revalidatePath('/', 'layout')
    return result
}

export async function signOut(redirectTo?: string) {
    const result = await betterSignOut({
        callbackURL: redirectTo,
    })
    revalidatePath('/', 'layout')
    return result
}
