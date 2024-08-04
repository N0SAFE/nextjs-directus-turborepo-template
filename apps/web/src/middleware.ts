// middleware.ts

import { stackMiddlewares } from './middlewares/utils/stackMiddlewares'
import { withHeaders } from './middlewares/WithHeaders'
import * as HealthCheckMiddleware from './middlewares/WithHealthCheck'
import * as AuthMiddleware from './middlewares/WithAuth'
import * as EnvMiddleware from './middlewares/WithEnv'
// import * as WithRedirect from "./middlewares/WithRedirect";
import getConfigSchema from './middlewares/utils/config/utils'
import { Middleware } from './middlewares/utils/types'
import { z } from 'zod'

const middlewares: Middleware[] = [
    withHeaders,
    EnvMiddleware,
    // HealthCheckMiddleware,
    AuthMiddleware,
    // WithRedirect,
]

const configSchema = getConfigSchema(middlewares)
const config: z.infer<typeof configSchema> = {}

export default stackMiddlewares(middlewares)
