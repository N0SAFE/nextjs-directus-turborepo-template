'use server'

import { z } from 'zod'
import { loginSchema } from './schema'
import { signIn } from '@/lib/auth/index'

export async function login(credentials: z.infer<typeof loginSchema>) {
    return signIn('credentials', { ...credentials, redirect: false })
}
