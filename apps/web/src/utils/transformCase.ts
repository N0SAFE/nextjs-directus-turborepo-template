import { SnakeCaseSeq } from "@repo/types/utils"

const snakeCase = require('lodash.snakecase')

export function keysToSnake<T extends Record<string, any>>(object: T) {
    return Object.keys(object).reduce(
        (acc, key) => {
            const snakeKey = snakeCase(key) as SnakeCaseSeq<keyof T extends string ? keyof T : never>
            acc[snakeKey as keyof typeof acc] = object[key]
            return acc
        },
        {} as Record<SnakeCaseSeq<keyof T extends string ? keyof T : never>, any>
    ) as T extends Record<string, any>
        ? {
            [K in keyof T as SnakeCaseSeq<K & string>]: T[K] extends Record<string, any>
                ? T[K] extends Array<infer U>
                    ? U[]
                    : T[K]
                : T[K]
        }
        : Record<string, any>
}
