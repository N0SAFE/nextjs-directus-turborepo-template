import zod from 'zod/v4'

const publicEnv = {
    REACT_SCAN_GIT_COMMIT_HASH: zod.string().optional(),
    REACT_SCAN_GIT_BRANCH: zod.string().optional(),
    REACT_SCAN_TOKEN: zod.string().optional(),
    NEXT_PUBLIC_API_URL: zod.string().url(),
    NEXT_PUBLIC_APP_URL: zod.string().url(),
    NEXT_PUBLIC_SIGNIN_PATH: zod.string().optional(),
    NEXT_PUBLIC_SHOW_AUTH_LOGS: zod
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional()
        .default(false),
}

const env = {
    ...publicEnv,
    NODE_ENV: zod.string(),
    BETTER_AUTH_SECRET: zod.string().optional(),
    BETTER_AUTH_URL: zod.string().url().optional(),
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
}

export const envSchemaPublic = zod.object(publicEnv)

export const envSchema = zod.object(env)

export const validateEnvSafe = (object: object) => {
    return envSchema.safeParse(object)
}

export const envIsValid = (object: object) => {
    return validateEnvSafe(object).success
}

export const validateEnv = (object: object) => {
    return envSchema.parse(object)
}

export const validatePublicEnvSafe = (object: object) => {
    return envSchemaPublic.safeParse(object)
}

export const publicEnvIsValid = (object: object) => {
    return validatePublicEnvSafe(object).success
}

export const validatePublicEnv = (object: object) => {
    return envSchemaPublic.parse(object)
}
