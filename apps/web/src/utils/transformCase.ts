const snakeCase = require('lodash.snakecase')

export function keysToSnake<T extends Record<string, any>>(object: T) {
    return Object.keys(object).reduce(
        (acc, key) => {
            acc[snakeCase(key)] = object[key]
            return acc
        },
        {} as Record<string, any>
    ) as T
}
