// Automatically generated by declarative-routing, do NOT edit
import { z } from 'zod'
import { makePostRoute, makeRoute } from './makeRoute'

const defaultInfo = {
    search: z.object({}),
}

import * as HomeRoute from '@/app/page.info'
import * as AppshowcaseRoute from '@/app/(app)/showcase/page.info'
import * as AppshowcaseClientRoute from '@/app/(app)/showcase/client/page.info'
import * as AppshowcaseServerRoute from '@/app/(app)/showcase/server/page.info'
import * as ApiauthnextauthRoute from '@/app/api/auth/[...nextauth]/route.info'
import * as ApiauthrefreshtokenRoute from '@/app/api/auth/refresh_token/route.info'
import * as AutherrorRoute from '@/app/auth/error/page.info'
import * as AuthloginRoute from '@/app/auth/login/page.info'
import * as AuthmeRoute from '@/app/auth/me/page.info'
import * as MiddlewareerrorenvRoute from '@/app/middleware/error/env/page.info'
import * as MiddlewareerrorhealthCheckRoute from '@/app/middleware/error/healthCheck/page.info'

export const Home = makeRoute('/', {
    ...defaultInfo,
    ...HomeRoute.Route,
})
export const Appshowcase = makeRoute('/(app)/showcase', {
    ...defaultInfo,
    ...AppshowcaseRoute.Route,
})
export const AppshowcaseClient = makeRoute('/(app)/showcase/client', {
    ...defaultInfo,
    ...AppshowcaseClientRoute.Route,
})
export const AppshowcaseServer = makeRoute('/(app)/showcase/server', {
    ...defaultInfo,
    ...AppshowcaseServerRoute.Route,
})
export const Apiauthnextauth = makeRoute('/api/auth/[...nextauth]', {
    ...defaultInfo,
    ...ApiauthnextauthRoute.Route,
})
export const Autherror = makeRoute('/auth/error', {
    ...defaultInfo,
    ...AutherrorRoute.Route,
})
export const Authlogin = makeRoute('/auth/login', {
    ...defaultInfo,
    ...AuthloginRoute.Route,
})
export const Authme = makeRoute('/auth/me', {
    ...defaultInfo,
    ...AuthmeRoute.Route,
})
export const Middlewareerrorenv = makeRoute('/middleware/error/env', {
    ...defaultInfo,
    ...MiddlewareerrorenvRoute.Route,
})
export const MiddlewareerrorhealthCheck = makeRoute(
    '/middleware/error/healthCheck',
    {
        ...defaultInfo,
        ...MiddlewareerrorhealthCheckRoute.Route,
    }
)

export const postApiauthrefreshtoken = makePostRoute(
    '/api/auth/refresh_token',
    {
        ...defaultInfo,
        ...ApiauthrefreshtokenRoute.Route,
    },
    ApiauthrefreshtokenRoute.POST
)
