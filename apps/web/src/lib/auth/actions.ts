'use server'

import { revalidatePath } from 'next/cache'
import { _, __ } from './index'

export async function signIn(...args: Parameters<typeof _>) {
    return _(...args)
}

export async function signOut(...args: Parameters<typeof __>) {
    const result = await __(...args)
    revalidatePath('/', 'layout')
    return result
}
