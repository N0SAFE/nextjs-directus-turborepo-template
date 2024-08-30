// middlewares/stackMiddlewares
import { NextResponse } from 'next/server'
import {
    CustomNextMiddleware,
    MatcherCondition,
    MatcherType,
    Middleware,
} from './types'

export function stackMiddlewares(
    functions: Middleware[] = [],
    config?: any,
    index = 0
): CustomNextMiddleware {
    const current = functions[index]
    if (current) {
        const next = stackMiddlewares(functions, config, index + 1)
        if (typeof current === 'function') {
            return current(next)
        }
        const { default: middleware, matcher } = current
        return (req, _next) => {
            if (!matcher) {
                return middleware(next)(req, _next)
            }

            const match = (m: MatcherType, context: any): boolean => {
                const condition = (m: MatcherCondition) => {
                    const { and, or, not } = m
                    const andBool = and?.every((m) => match(m, context)) ?? true
                    const orBool = or?.some((m) => match(m, context)) ?? true
                    const notBool = Array.isArray(not)
                        ? not.some((m) => !match(m, context))
                        : not
                          ? !match(not, context)
                          : true
                    return andBool && orBool && notBool
                }
                if (typeof m === 'string') {
                    return new RegExp(m).test(req.nextUrl.pathname)
                } else if (m instanceof RegExp) {
                    return m.test(req.nextUrl.pathname)
                } else if (typeof m === 'function') {
                    return match(m(req, context), context)
                } else if (typeof m === 'boolean') {
                    return m
                } else {
                    return condition(m)
                }
            }
            if (Array.isArray(matcher)) {
                const ctx = Array(matcher.length).fill({})
                const index = matcher.findIndex((m, i) => match(m, ctx[i]))
                if (index > -1) {
                    return middleware(next)(req, _next, {
                        key: index,
                        ctx: ctx[index],
                    })
                }
            } else if (typeof matcher === 'object') {
                const ctx = Object.keys(matcher).reduce(
                    (acc, key) => ({ ...acc, [key]: {} }),
                    {}
                )
                const key = Object.keys(matcher).find((m, key) =>
                    match(matcher[m], (ctx as any)[key])
                )
                if (key) {
                    return middleware(next)(req, _next, {
                        key,
                        ctx: (ctx as any)[key],
                    })
                }
            }
            return next(req, _next)
        }
    }
    return () => NextResponse.next()
}
