import { betterAuth } from "better-auth"
import { emailAndPassword } from "better-auth/plugins"
import { createDirectusEdgeWithDefaultUrl } from "../directus/directus-edge"
import { readMe, withToken } from "@repo/directus-sdk"
import { validateEnv } from "#/env"

const env = validateEnv(process.env)

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: ":memory:", // Using in-memory SQLite since we only need sessions, not user storage
  },
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    
    // Custom user lookup and verification against Directus
    async signIn(email, password, request) {
      try {
        const directus = createDirectusEdgeWithDefaultUrl()
        
        if (env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
          console.log('Better Auth Directus: Attempting login for:', email)
        }
        
        // Authenticate with Directus
        const authResult = await directus.login(email, password, {
          mode: 'json',
        })
        
        if (env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
          console.log('Better Auth Directus: Login successful')
        }
        
        // Get user details from Directus
        const directusUser = await directus.request(
          withToken(
            authResult.access_token ?? '',
            readMe({
              fields: [
                'id',
                'email',
                'first_name',
                'last_name',
                'avatar',
              ],
            })
          )
        )
        
        // Store Directus tokens in user object for later use
        const user = {
          id: directusUser.id,
          email: directusUser.email ?? email,
          name: `${directusUser.first_name ?? ''} ${directusUser.last_name ?? ''}`.trim(),
          image: directusUser.avatar ? `/assets/${directusUser.avatar}` : null,
          // Custom fields for Directus integration
          directusAccessToken: authResult.access_token,
          directusRefreshToken: authResult.refresh_token,
          directusTokenExpires: authResult.expires,
        }
        
        if (env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
          console.log('Better Auth Directus: User authenticated:', user.email)
        }
        
        return {
          user,
        }
      } catch (error: unknown) {
        if (env.NEXT_PUBLIC_SHOW_AUTH_LOGS) {
          console.error('Better Auth Directus: Login failed:', error)
        }
        throw new Error("Invalid email or password")
      }
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  
  secret: env.AUTH_SECRET || env.NEXTAUTH_SECRET || "fallback-secret-for-dev",
  
  baseURL: env.NEXT_PUBLIC_APP_URL,
  
  trustedOrigins: [
    env.NEXT_PUBLIC_APP_URL,
  ],
})

export type Session = typeof auth.$Infer.Session & {
  user: typeof auth.$Infer.User & {
    directusAccessToken?: string
    directusRefreshToken?: string
    directusTokenExpires?: number
  }
}

export type User = typeof auth.$Infer.User & {
  directusAccessToken?: string
  directusRefreshToken?: string
  directusTokenExpires?: number
}