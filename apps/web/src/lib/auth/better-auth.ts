import { betterAuth } from "better-auth"
import { validateEnv } from "#/env"

const env = validateEnv(process.env)

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: ":memory:", // Using in-memory SQLite for sessions
  },
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  
  secret: env.AUTH_SECRET || "fallback-secret-for-dev",
  
  baseURL: env.NEXT_PUBLIC_APP_URL,
  
  trustedOrigins: [
    env.NEXT_PUBLIC_APP_URL,
  ],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user