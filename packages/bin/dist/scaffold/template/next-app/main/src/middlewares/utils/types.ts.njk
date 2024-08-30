// middleware/types.ts

import { NextMiddleware, NextRequest } from 'next/server'

type AddParameters<
    TFunction extends (...args: any) => any,
    TParameters extends [...args: any],
> = (
    ...args: [...Parameters<TFunction>, ...TParameters]
) => ReturnType<TFunction>

export type CustomNextMiddleware = AddParameters<
    NextMiddleware,
    [meta?: { key: number | string; ctx: any }]
>
export type MiddlewareFactory = (
    middleware: CustomNextMiddleware
) => CustomNextMiddleware
export type Middleware =
    | MiddlewareFactory
    | {
          default: MiddlewareFactory
          matcher?: Matcher
          config?: ConfigFactory
      }
export type MatcherCondition = {
    and?: MatcherTypeArray
    or?: MatcherTypeArray
    not?: MatcherTypeArray | MatcherType
}
export type MatcherCallback = (req: NextRequest, ctx: any) => MatcherType
export type MatcherType =
    | string
    | RegExp
    | MatcherCondition
    | MatcherCallback
    | boolean
export type MatcherTypeArray = MatcherType[]
export type MatcherTypeRecord = Record<string, MatcherType>
export type ConfiguredMatcher = (
    matcher: MatcherTypeArray | MatcherCallback
) => Exclude<Matcher, ConfiguredMatcher>
export type Matcher =
    | MatcherTypeArray
    | MatcherTypeRecord
    | MatcherCallback
    | boolean
    | ConfiguredMatcher

export type ConfigFactory = {
    name: string
    matcher?: true
}
