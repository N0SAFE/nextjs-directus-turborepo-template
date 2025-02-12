import zod from 'zod'

const publicEnv = {
    REACT_SCAN_GIT_COMMIT_HASH: zod.string().optional(),
    REACT_SCAN_GIT_BRANCH: zod.string().optional(),
    REACT_SCAN_TOKEN: zod.string().optional(),
    NEXT_PUBLIC_API_URL: zod.string().url(),
    NEXT_PUBLIC_APP_URL: zod.string().url(),
    NEXT_PUBLIC_SIGNIN_PATH: zod.string().optional(),
}

const env = {
    ...publicEnv,
    API_ADMIN_TOKEN: zod.string(),
    NODE_ENV: zod.string(),
    AUTH_SECRET: zod.string(),
    REACT_SCAN: zod
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional()
        .default('false'),
    MILLION_LINT: zod
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional()
        .default('false'),
    NEXT_PUBLIC_SHOW_AUTH_LOGS: zod
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional()
        .default('false'),
}

export const envSchemaPublic = zod.object(publicEnv)

export const envSchema = zod.object(env)

export const validateEnvSafe = (object: any) => {
    return envSchema.safeParse(object)
}

export const envIsValid = (object: any) => {
    return validateEnvSafe(object).success
}

export const validateEnv = (object: any) => {
    return envSchema.parse(object)
}

export const validatePublicEnvSafe = (object: any) => {
    return envSchemaPublic.safeParse(object)
}

export const publicEnvIsValid = (object: any) => {
    return validatePublicEnvSafe(object).success
}

export const validatePublicEnv = (object: any) => {
    return envSchemaPublic.parse(object)
}
