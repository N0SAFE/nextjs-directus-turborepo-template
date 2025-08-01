"use client"

import { createAuthClient } from "better-auth/react"
import { validateEnv } from "#/env"
import { BetterAuthClientPlugin } from "better-auth"
import { Collections } from "@repo/directus-sdk/client"

const clientPlugin = {
  id: "custom-user-fields",
   $InferServerPlugin: {
      id: "directus-user-server",
      schema: {
        user: {
          fields: {
            // Directus-specific user fields
            avatar: {
              type: "string",
              required: false,
            },
            title: {
              type: "string", 
              required: false,
            },
            description: {
              type: "string",
              required: false,
            },
            tags: {
              type: "string",
              required: false,
            },
            language: {
              type: "string",
              required: false,
            },
            theme: {
              type: "string",
              required: false,
            },
            tfa_secret: {
              type: "string",
              required: false,
            },
            status: {
              type: "string",
              required: false,
            },
            role: {
              type: "string",
              required: false,
            },
            location: {
              type: "string",
              required: false,
            },
            last_access: {
              type: "string",
              required: false,
            },
            last_page: {
              type: "string", 
              required: false,
            },
            provider: {
              type: "string",
              required: false,
            },
            external_identifier: {
              type: "string",
              required: false,
            },
            auth_data: {
              type: "string",
              required: false,
            },
            email_notifications: {
              type: "boolean",
              required: false,
            },
            appearance: {
              type: "string",
              required: false,
            },
            theme_dark: {
              type: "string", 
              required: false,
            },
            theme_light: {
              type: "string",
              required: false,
            },
            theme_light_overrides: {
              type: "string",
              required: false,
            },
            theme_dark_overrides: {
              type: "string",
              required: false,
            },
          },
        },
        session: {
          fields: {
            // Directus-specific session fields
            access_token: {
              type: "string",
              required: false,
            },
            refresh_token: {
              type: "string",
              required: false,
            },
            expires_at: {
              type: "string",
              required: false,
            },
          },
        },
      },
    } as const,
    
    // Custom client actions for Directus integration
    getActions: ($fetch) => ({
      /**
       * Get current user data from Directus
       */
      getDirectusUser: async () => {
        return $fetch("/api/auth/directus/me", {
          method: "GET",
        })
      },
      
      /**
       * Update user profile in Directus
       */
      updateDirectusUser: async (data: Partial<Collections.DirectusUser>) => {
        return $fetch("/api/auth/directus/me", {
          method: "PATCH",
          body: data,
        })
      },
      
      /**
       * Upload user avatar to Directus
       */
      uploadAvatar: async (file: File) => {
        const formData = new FormData()
        formData.append("file", file)
        
        return $fetch("/api/auth/directus/avatar", {
          method: "POST",
          body: formData,
        })
      },
    }),
    
    // Path methods for server endpoints
    pathMethods: {
      "/directus/me": "GET",
      "/directus/avatar": "POST",
    },
} satisfies BetterAuthClientPlugin

const env = validateEnv(process.env)

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    clientPlugin
  ]
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
  $store,
  $fetch,
  $ERROR_CODES,
  $Infer
} = authClient