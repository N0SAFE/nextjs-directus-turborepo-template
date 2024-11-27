'use server'

import { _, __ } from './index'

export async function signIn(...args: Parameters<typeof _>) {
    return _(...args)
}

export async function signOut(...args: Parameters<typeof __>) {
    return __(...args)
}
