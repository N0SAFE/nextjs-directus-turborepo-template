// ! to snake

export type UpperCaseLetters =
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'H'
    | 'I'
    | 'J'
    | 'K'
    | 'L'
    | 'M'
    | 'N'
    | 'O'
    | 'P'
    | 'Q'
    | 'R'
    | 'S'
    | 'T'
    | 'U'
    | 'V'
    | 'W'
    | 'X'
    | 'Y'
    | 'Z'
    | '0'
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'

export type SnakeCaseSeq<S extends string> = S extends `${infer P1}${infer P2}`
    ? P1 extends UpperCaseLetters
        ? `_${Lowercase<P1>}${SnakeCaseSeq<P2>}`
        : `${P1}${SnakeCaseSeq<P2>}`
    : Lowercase<S>

export type ToSnake<S extends string> = S extends `${infer P1}${infer P2}`
    ? `${Lowercase<P1>}${SnakeCaseSeq<P2>}`
    : Lowercase<S>

export type FromCamelToSnake<T extends string> = ToSnake<T>
export type FromPascalToSnake<T extends string> = ToSnake<T>

export type ObjectToSnake<T> = {
    [K in keyof T as Lowercase<string & K>]: T[K] extends Record<string, any>
        ? ObjectToSnake<T[K]>
        : T[K]
}
export type ObjectFromCamelToSnake<T> = ObjectToSnake<T>
export type ObjectFromPascalToSnake<T> = ObjectToSnake<T>

export type KeysToSnake<T> = {
    [K in keyof T as Lowercase<string & K>]: T[K]
}
export type KeysFromCamelToSnake<T> = KeysToSnake<T>
export type KeysFromPascalToSnake<T> = KeysToSnake<T>

// ! to pascal

export type CamelToPascal<T extends string> =
    T extends `${infer FirstChar}${infer Rest}`
        ? `${Capitalize<FirstChar>}${Rest}`
        : never
export type SnakeToPascal<T extends string> =
    T extends `${infer P1}_${infer P2}`
        ? `${Capitalize<P1>}${SnakeToPascal<P2>}`
        : Capitalize<T>
export type ToPascal<T extends string> = CamelToPascal<SnakeToPascal<T>>

export type ObjectFromCamelToPascal<T> = {
    [K in keyof T as CamelToPascal<string & K>]: T[K] extends Record<
        string,
        any
    >
        ? ObjectFromCamelToPascal<T[K]>
        : T[K]
}
export type ObjectFromSnakeToPascal<T> = {
    [K in keyof T as SnakeToPascal<string & K>]: T[K] extends Record<
        string,
        any
    >
        ? ObjectFromSnakeToPascal<T[K]>
        : T[K]
}
export type ObjectToPascal<T> = {
    [K in keyof T as ToPascal<string & K>]: T[K] extends Record<string, any>
        ? ObjectToPascal<T[K]>
        : T[K]
}

export type KeysFromCamelToPascal<T> = {
    [K in keyof T as CamelToPascal<string & K>]: T[K]
}
export type KeysFromSnakeToPascal<T> = {
    [K in keyof T as SnakeToPascal<string & K>]: T[K]
}
export type KeysToPascal<T> = {
    [K in keyof T as ToPascal<string & K>]: T[K]
}
// ! to camel

export type SnakeToCamel<S extends string> =
    S extends `${infer P1}_${infer P2}${infer P3}`
        ? `${Lowercase<P1>}${Uppercase<P2>}${SnakeToCamel<P3>}`
        : Uncapitalize<S>
export type PascalToCamel<S extends string> =
    S extends `${infer FirstChar}${infer Rest}`
        ? `${Lowercase<FirstChar>}${Rest}`
        : never
export type ToCamel<S extends string> = PascalToCamel<SnakeToCamel<S>>

export type ObjectFromSnakeToCamel<T> = {
    [K in keyof T as SnakeToCamel<string & K>]: T[K] extends Record<string, any>
        ? ObjectFromSnakeToCamel<T[K]>
        : T[K]
}
export type ObjectFromPascalToCamel<T> = {
    [K in keyof T as PascalToCamel<string & K>]: T[K] extends Record<
        string,
        any
    >
        ? ObjectFromPascalToCamel<T[K]>
        : T[K]
}
export type ObjectToCamel<T> = {
    [K in keyof T as ToCamel<string & K>]: T[K] extends Record<string, any>
        ? ObjectToCamel<T[K]>
        : T[K]
}

export type KeysFromSnakeToCamel<T> = {
    [K in keyof T as SnakeToCamel<string & K>]: T[K]
}
export type KeysFromPascalToCamel<T> = {
    [K in keyof T as PascalToCamel<string & K>]: T[K]
}
export type KeysToCamel<T> = {
    [K in keyof T as ToCamel<string & K>]: T[K]
}

export type TupleIndices<A extends any[]> = A extends [any, ...infer T]
    ? TupleIndices<T> | T['length']
    : never

export type Prettify<T> = {
    [K in keyof T]: T[K]
    // eslint-disable-next-line @typescript-eslint/ban-types
} & {}
export type Promisable<T> = T | Promise<T>
export type OmitNever<T extends object> = {
    [K in keyof T as T[K] extends never ? never : K]: T[K]
}

export const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

// credits goes to https://stackoverflow.com/a/50375286
export type UnionToIntersection<U> = (
    U extends any ? (k: U) => void : never
) extends (k: infer I) => void
    ? I
    : never

// Converts union to overloaded function
export type UnionToOvlds<U> = UnionToIntersection<
    U extends any ? (f: U) => void : never
>

export type PopUnion<U> =
    UnionToOvlds<U> extends (a: infer A) => void ? A : never

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true

// Finally me)
export type UnionToArray<T, A extends unknown[] = []> =
    IsUnion<T> extends true
        ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
        : [T, ...A]

export type IntersectArray<A extends unknown[]> = A extends [
    infer F,
    ...infer R,
]
    ? F & IntersectArray<R>
    : {}

export type ArrayContains<
    T extends unknown[],
    U,
    Y = true,
    N = false,
> = U extends T[number] ? Y : N
