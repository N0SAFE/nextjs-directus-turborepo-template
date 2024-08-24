// middleware.ts

import { stackMiddlewares } from './middlewares/utils/stackMiddlewares'
import { withHeaders } from './middlewares/WithHeaders'
import * as HealthCheckMiddleware from './middlewares/WithHealthCheck'
import * as AuthMiddleware from './middlewares/WithAuth'
import * as EnvMiddleware from './middlewares/WithEnv'
// import * as WithRedirect from "./middlewares/WithRedirect";
import { Middleware } from './middlewares/utils/types'

const middlewares: Middleware[] = [
    withHeaders,
    EnvMiddleware,
    HealthCheckMiddleware,
    AuthMiddleware,
    // WithRedirect,
]

export default stackMiddlewares(middlewares)
