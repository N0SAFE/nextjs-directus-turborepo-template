// "use server";

// import {
//   AuthenticationData,
//   login as directusLogin,
//   readMe,
//   ReadUserOutput,
// } from "@directus/sdk";
// import directus from "@/lib/directus";
// import { validateEnv } from "#/env";

// const env = validateEnv(process.env as any);

// export const login = async (email: string, password: string) => {
//   const data = await directus.request(directusLogin(email, password));
//   const user = await directus.request(readMe());
// };

// import {
//     RequestCookies,
//     ResponseCookies,
// } from 'next/dist/compiled/@edge-runtime/cookies'
// import { cookies } from 'next/headers'
// import { components } from '@/types/api-collection'

// export type Session =
//     | {
//           authenticationAttempted: true
//           isAuthenticated: true
//           isGuest: false
//           isLoggedIn: true
//           jwt: AuthenticationData
//           user: components["schemas"]["Users"];
//       }
//     | {
//           authenticationAttempted: true
//           isAuthenticated: false
//           isGuest: true
//           isLoggedIn: false
//           jwt: null
//           user: null
//       }

// export async function setSession(
//     session: Session,
//     cookiesStore?: RequestCookies | ResponseCookies
// ): Promise<Session | null> {
//     const expiresAt = (() => {
//         if (session?.isAuthenticated) {
//             return new Date(session.jwt.expires_at)
//         } else {
//             return new Date(0)
//         }
//     })()

//     console.log('create cookie')
//     console.log(session)

//     const cookieStore = cookiesStore ? cookiesStore : cookies()
//     cookieStore.set('session', JSON.stringify(session), {
//         path: '/',
//         httpOnly: false,
//         sameSite: 'strict',
//         secure: env.NODE_ENV === 'production',
//         expires: expiresAt,
//     })
//     cookieStore.set(
//         'jwt',
//         JSON.stringify(session?.jwt) || '',
//         {
//             path: '/',
//             httpOnly: false,
//             sameSite: 'strict',
//             secure: env.NODE_ENV === 'production',
//             expires: expiresAt,
//         }
//     )
//     cookieStore.set('refreshToken', session?.jwt?.refresh_token || '', {
//         path: '/',
//         httpOnly: false,
//         sameSite: 'strict',
//         secure: env.NODE_ENV === 'production',
//     })

//     return session
// }

// export async function getJwt(): Promise<Session['jwt']> {
//     return (await getSession())?.jwt || null
// }

// export async function updateSession(
//     session: Partial<Session>
// ): Promise<Session | null> {
//     const oldSession = await getSession()
//     return setSession({ ...oldSession, ...session } as Session)
// }

// export async function getSession(
//     cookiesStore?: RequestCookies | ResponseCookies
// ): Promise<Session | null> {
//     const cookieStore = cookiesStore ? cookiesStore : cookies()
//     const sessionString = cookieStore.get('session')?.value
//     const jwtString = cookieStore.get('jwt')?.value
//     const refreshTokenString = cookieStore.get('refreshToken')?.value
//     if (!sessionString && !refreshTokenString) {
//         return null
//     }
//     try {
//         const session = sessionString
//             ? JSON.parse(sessionString)
//             : {
//                   authenticationAttempted: false,
//                   isAuthenticated: false,
//                   isGuest: true,
//                   isLoggedIn: false,
//                   jwt: null,
//                   user: null,
//               }
//         const jwt = jwtString ? JSON.parse(jwtString) : {}
//         jwt.refreshToken = refreshTokenString
//         session.jwt = jwt
//         return session
//     } catch {
//         return null
//     }
// }

// export async function getUser(): Promise<components["schemas"]["Users"] | null> {
//     return (await getSession())?.user || null
// }

// export async function cookiesGetAll() {
//     return cookies().getAll()
// }

// export async function refreshToken(
//     retry?: boolean,
//     readCookieStore?: RequestCookies | ResponseCookies,
//     writeCookieStoreOnSucess?: RequestCookies | ResponseCookies,
//     writeCookieStoreOnError?: RequestCookies | ResponseCookies
// ): Promise<Session> {
//     return xiorInstance
//         .post<any>('/refresh', {}, {
//             // withCredentials: true,
//             headers: {
//                 refresh_token: (await getSession(readCookieStore))?.jwt
//                     ?.refreshToken,
//             },
//             _retry: retry,
//         } as any)
//         .then(async (res) => {
//             const jwt = res.data
//             return xiorInstance
//                 .get<Session>('/whoami', {
//                     withCredentials: true,
//                     headers: {
//                         Authorization: `Bearer ${res.data.token}`,
//                     },
//                 })
//                 .then(async (res) => {
//                     const session = {
//                         ...res.data,
//                         jwt: jwt,
//                     }
//                     await setSession(session, writeCookieStoreOnSucess)
//                     return session
//                 })
//         })
//         .catch(async function (e) {
//             await setSession(
//                 {
//                     authenticationAttempted: true,
//                     isAuthenticated: false,
//                     isGuest: true,
//                     isLoggedIn: false,
//                     jwt: null,
//                     user: null,
//                 },
//                 writeCookieStoreOnError
//             )
//             return {
//                 authenticationAttempted: true,
//                 isAuthenticated: false,
//                 isGuest: true,
//                 isLoggedIn: false,
//                 jwt: null,
//                 user: null,
//             }
//         })
// }

// export async function whoami(): Promise<Session> {
//     const jwt = (await getSession())?.jwt
//     const whoami = await xiorInstance
//         .get('/whoami', {
//             withCredentials: true,
//             headers: {
//                 Authorization:
//                     (jwt as any)?.token && `Bearer ${(jwt as any).token}`,
//             },
//         })
//         .then((res) => res.data)
//     const newSession = whoami
//     if (whoami.isAuthenticated) {
//         newSession.jwt = jwt
//         setSession(newSession)
//         return newSession
//     } else {
//         newSession.jwt = null
//         setSession(newSession)
//         return newSession
//     }
// }

// export async function login(
//     email: string,
//     password: string
// ): Promise<Session | null> {
//     return xiorInstance
//         .post(
//             '/login',
//             {
//                 email,
//                 password,
//             },
//             { withCredentials: true }
//         )
//         .then(async (res) => {
//             const jwt = res.data
//             console.log(jwt)
//             return xiorInstance
//                 .get<Session>('/whoami', {
//                     withCredentials: true,
//                     headers: {
//                         Authorization: `Bearer ${res.data.token}`,
//                     },
//                 })
//                 .then((res) => {
//                     const session = {
//                         ...res.data,
//                         jwt: jwt,
//                     }
//                     setSession(session)
//                     return session
//                 })
//         })
//         .catch((e) => {
//             console.log('e', e)
//             return null
//         })
// }

// export async function logout() {
//     const token = (await getSession())?.jwt?.token

//     return xiorInstance
//         .post(
//             '/logout',
//             {},
//             {
//                 withCredentials: true,
//                 headers: {
//                     Authorization: token && `Bearer ${token}`,
//                 },
//             }
//         )
//         .then(async () => {
//             await setSession({
//                 authenticationAttempted: true,
//                 isAuthenticated: false,
//                 isGuest: true,
//                 isLoggedIn: false,
//                 jwt: null,
//                 user: null,
//             })
//         })
// }

// export async function recreteJwt() {
//     return xiorInstance
//         .get('/recreate-jwt', {
//             // todo
//             withCredentials: true,
//             headers: {
//                 Authorization: `Bearer ${(await getSession())?.jwt?.token}`,
//             },
//         })
//         .then(async (res) => {
//             const jwt = res.data
//             return xiorInstance
//                 .get<Session>('/whoami', {
//                     withCredentials: true,
//                     headers: {
//                         Authorization: `Bearer ${res.data.token}`,
//                     },
//                 })
//                 .then((res) => {
//                     const session = {
//                         ...res.data,
//                         jwt: jwt,
//                     }
//                     setSession(session)
//                     return session
//                 })
//         })
// }

// export async function isLogin(options?: {
//     session?: Session
//     cookieStore?: RequestCookies | ResponseCookies
// }) {
//     if (options?.session) {
//         return options?.session?.isAuthenticated
//     }
//     return getSession(options?.cookieStore)?.then((res) => res?.isAuthenticated)
// }
