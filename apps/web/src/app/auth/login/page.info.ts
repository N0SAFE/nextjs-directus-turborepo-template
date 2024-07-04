import { z } from 'zod'

export const Route = {
    name: 'Authlogin',
    params: z.object({}),
    search: z.object({
        callbackUrl: z.string().optional(),
    }),
}
