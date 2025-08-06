import zod from 'zod/v4'

export const envSchema = zod.object({
    REACT_SCAN_GIT_COMMIT_HASH: zod.string().optional(),
    REACT_SCAN_GIT_BRANCH: zod.string().optional(),
    REACT_SCAN_TOKEN: zod.string().optional(),
    NEXT_PUBLIC_APP_URL: zod.url().transform((url) => {
        if (url.endsWith('/')) {
            return url.slice(0, -1)
        }
        return url
    }),
    NEXT_PUBLIC_SHOW_AUTH_LOGS: zod
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional()
        .default(false),
    API_URL: zod.url().transform((url) => {
        if (url.endsWith('/')) {
            return url.slice(0, -1)
        }
        return url
    }),
    NODE_ENV: zod.string(),
    BETTER_AUTH_SECRET: zod.string().optional(),
    BETTER_AUTH_URL: zod.url().optional(),
    REACT_SCAN: zod
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional()
        .default(false),
    MILLION_LINT: zod
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional()
        .default(false),
})

export const validateEnvSafe = (object: object) => {
    return envSchema.safeParse(object)
}

export const envIsValid = (object: object) => {
    return validateEnvSafe(object).success
}

export const validateEnv = (object: object) => {
    return envSchema.parse(object)
}

export const validateEnvPath = <T extends keyof typeof envSchema.shape>(input: zod.input<typeof envSchema.shape[T]>, path: T): zod.infer<typeof envSchema.shape[T]> => {
    return envSchema.shape[path].parse(input) as zod.infer<typeof envSchema.shape[T]>
}
