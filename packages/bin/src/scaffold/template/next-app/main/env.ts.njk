import zod from 'zod'

const publicEnv = {
    NEXT_PUBLIC_API_URL: zod.string().url(),
}

const env = {
    ...publicEnv,
    API_ADMIN_TOKEN: zod.string(),
    NODE_ENV: zod.string(),
    NEXTAUTH_SECRET: zod.string(),
    NEXTAUTH_URL: zod.string().url(),
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
