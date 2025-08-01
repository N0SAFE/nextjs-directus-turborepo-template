"use client"

import { createAuthClient } from "better-auth/react"
import { validateEnv } from "#/env"

const env = validateEnv(process.env)

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient