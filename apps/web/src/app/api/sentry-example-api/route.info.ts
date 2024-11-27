import { z } from 'zod'

export const Route = {
    name: 'ApisentryExampleApi',
    params: z.object({}),
}

export const GET = {
    result: z.object({}),
}
