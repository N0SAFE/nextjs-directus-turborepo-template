import { z } from 'zod'

export const Route = {
    name: 'Apiauthrefreshtoken',
    params: z.object({}),
}

export const POST = {
    body: z.object({
        refresh_token: z.string(),
    }),
    result: z.object({
        access_token: z.optional(z.string()),
        refresh_token: z.optional(z.string()),
        expires: z.optional(z.number()),
        expires_at: z.optional(z.number()),
    }),
    description: 'Refreshes the access token',
}
