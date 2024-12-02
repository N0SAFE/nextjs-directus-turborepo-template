import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import {
    DefaultError,
    DefinedInitialDataInfiniteOptions,
    DefinedInitialDataOptions,
    DefinedUseInfiniteQueryResult,
    DefinedUseQueryResult,
    InfiniteData,
    QueryClient,
    QueryFunctionContext,
    QueryKey,
    UndefinedInitialDataInfiniteOptions,
    UndefinedInitialDataOptions,
    useInfiniteQuery,
    UseInfiniteQueryOptions,
    UseInfiniteQueryResult,
    useMutation,
    UseMutationOptions,
    useQuery,
    UseQueryOptions,
    UseQueryResult,
} from '@tanstack/react-query'
import { ArrayContains, UnionToArray } from '@repo/types/utils'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const handleError = (error: string) => {
    throw new Error(error)
}

export function toAbsoluteUrl(path: string) {
    return `${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')}${path}`
}

export type FunctionContext<
    TParams = QueryKey,
    TPageParam = unknown,
    TQueryKey extends QueryKey = QueryKey,
> = QueryFunctionContext<TQueryKey, TPageParam> & { params: TParams }

export function toAdvancedUseQuery<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TParams extends QueryKey = QueryKey, // this is the additional parameters
    TPageParam = unknown,
>(
    func: (
        ctx: FunctionContext<TParams, TPageParam, TQueryKey>
    ) => TQueryFnData | Promise<TQueryFnData>
) {
    return function use<
        Options extends Omit<
            | (DefinedInitialDataOptions<
                  TQueryFnData,
                  TError,
                  TData,
                  TQueryKey
              > &
                  ArrayContains<UnionToArray<TParams['length']>, 0> extends true // this check if the params can be optional because it require no arguments
                  ? { params?: TParams }
                  : { params: TParams })
            | (UndefinedInitialDataOptions<
                  TQueryFnData,
                  TError,
                  TData,
                  TQueryKey
              > &
                  ArrayContains<UnionToArray<TParams['length']>, 0> extends true // this check if the params can be optional because it require no arguments
                  ? { params?: TParams }
                  : { params: TParams })
            | (UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & // this check if the params can be optional because it require no arguments
                  ArrayContains<UnionToArray<TParams['length']>, 0> extends true
                  ? { params?: TParams }
                  : { params: TParams }),
            'queryKey'
        > & { queryKey?: TQueryKey } = Omit<
            UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & // this check if the params can be optional because it require no arguments
                ArrayContains<UnionToArray<TParams['length']>, 0> extends true
                ? { params?: TParams }
                : { params: TParams },
            'queryKey'
        > & { queryKey?: TQueryKey },
    >(options: Options, queryClient?: QueryClient) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useQuery<TQueryFnData, TError, TData, TQueryKey>(
            {
                ...options,
                queryFn: (ctx) =>
                    func({
                        ...ctx,
                        params: options.params || [],
                    } as FunctionContext<TParams, TPageParam, TQueryKey>),
                queryKey: [
                    ...(options.queryKey ?? []),
                    ...(options.params ?? []),
                ],
            },
            queryClient
        ) as Options extends DefinedInitialDataOptions<
            TQueryFnData,
            TError,
            TData,
            TQueryKey
        >
            ? DefinedUseQueryResult<TData, TError>
            : UseQueryResult<TData, TError>
    }
}

export function toUseQuery<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TParams extends QueryKey = QueryKey,
    TPageParam = unknown,
>(func: (...args: TParams) => TQueryFnData | Promise<TQueryFnData>) {
    return toAdvancedUseQuery<
        TQueryFnData,
        TError,
        TData,
        TQueryKey,
        TParams,
        TPageParam
    >(({ params }) => func(...(params as TParams))) // add a function withDefault to add default params to this function (toUseQuery().withDefault({queryKey: ['example']})({params: [1]})
}

export function toAdvancedUseSuspenseQuery<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TParams extends QueryKey = QueryKey,
    TPageParam = unknown,
>(
    func: (
        ctx: FunctionContext<TParams, TPageParam, TQueryKey>
    ) => TQueryFnData | Promise<TQueryFnData>
) {
    return function use<
        Options extends Omit<
            | (DefinedInitialDataOptions<
                  TQueryFnData,
                  TError,
                  TData,
                  TQueryKey
              > &
                  (ArrayContains<
                      UnionToArray<TParams['length']>,
                      0
                  > extends true // this check if the params can be optional because it require no arguments
                      ? { params?: TParams }
                      : { params: TParams }))
            | (UndefinedInitialDataOptions<
                  TQueryFnData,
                  TError,
                  TData,
                  TQueryKey
              > &
                  (ArrayContains<
                      UnionToArray<TParams['length']>,
                      0
                  > extends true // this check if the params can be optional because it require no arguments
                      ? { params?: TParams }
                      : { params: TParams }))
            | (UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & // this check if the params can be optional because it require no arguments
                  (ArrayContains<
                      UnionToArray<TParams['length']>,
                      0
                  > extends true
                      ? { params?: TParams }
                      : { params: TParams })),
            'queryKey'
        > & { queryKey?: TQueryKey } = Omit<
            UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & // this check if the params can be optional because it require no arguments
                (ArrayContains<UnionToArray<TParams['length']>, 0> extends true
                    ? { params?: TParams }
                    : { params: TParams }),
            'queryKey'
        > & { queryKey?: TQueryKey },
    >(options: Options, queryClient?: QueryClient) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useQuery<TQueryFnData, TError, TData, TQueryKey>(
            {
                ...options,
                queryFn: (ctx) =>
                    func({
                        ...ctx,
                        params: options.params || [],
                    } as FunctionContext<TParams, TPageParam, TQueryKey>),
                queryKey: [
                    ...(options.queryKey ?? []),
                    ...(options.params ?? []),
                ],
                suspense: true,
            },
            queryClient
        ) as Options extends DefinedInitialDataOptions<
            TQueryFnData,
            TError,
            TData,
            TQueryKey
        >
            ? DefinedUseQueryResult<TData, TError>
            : UseQueryResult<TData, TError>
    }
}

export function toUseSuspenseQuery<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TParams extends QueryKey = QueryKey,
    TPageParam = unknown,
>(func: (...args: TParams) => TQueryFnData | Promise<TQueryFnData>) {
    return toAdvancedUseSuspenseQuery<
        TQueryFnData,
        TError,
        TData,
        TQueryKey,
        TParams,
        TPageParam
    >(({ params }) => func(...(params as TParams))) // add a function withDefault to add default params to this function (toUseQuery().withDefault({queryKey: ['example']})({params: [1]})
}

export function toUseMutation<
    TData = unknown,
    TError = DefaultError,
    TVariables = void,
    TContext = unknown,
>(func: (variables: TVariables) => TData | Promise<TData>) {
    return function use<
        Options extends UseMutationOptions<
            TData,
            TError,
            TVariables,
            TContext
        > = UseMutationOptions<TData, TError, TVariables, TContext>,
    >(options: Options, queryClient?: QueryClient) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useMutation<TData, TError, TVariables, TContext>(
            {
                ...options,
                mutationFn: (variables) => func(variables),
            },
            queryClient
        )
    }
}

export function toAdvancedUseInfiniteQuery<
    TQueryFnData,
    TError = DefaultError,
    TData = InfiniteData<TQueryFnData>,
    TQueryKey extends QueryKey = QueryKey,
    TParams extends QueryKey = QueryKey,
    TPageParam = unknown,
>(
    func: (
        ctx: FunctionContext<TParams, TPageParam, TQueryKey>
    ) => TQueryFnData | Promise<TQueryFnData>
) {
    return function use<
        Options extends Omit<
            | (DefinedInitialDataInfiniteOptions<
                  TQueryFnData,
                  TError,
                  TData,
                  TQueryKey,
                  TPageParam
              > &
                  (ArrayContains<
                      UnionToArray<TParams['length']>,
                      0
                  > extends true // this check if the params can be optional because it require no arguments
                      ? { params?: TParams }
                      : { params: TParams }))
            | (UndefinedInitialDataInfiniteOptions<
                  TQueryFnData,
                  TError,
                  TData,
                  TQueryKey,
                  TPageParam
              > &
                  (ArrayContains<
                      UnionToArray<TParams['length']>,
                      0
                  > extends true // this check if the params can be optional because it require no arguments
                      ? { params?: TParams }
                      : { params: TParams }))
            | (UseInfiniteQueryOptions<
                  TQueryFnData,
                  TError,
                  TData,
                  TQueryFnData,
                  TQueryKey,
                  TPageParam
              > & // this check if the params can be optional because it require no arguments
                  (ArrayContains<
                      UnionToArray<TParams['length']>,
                      0
                  > extends true
                      ? { params?: TParams }
                      : { params: TParams })),
            'queryKey'
        > & { queryKey?: TQueryKey } = Omit<
            UseInfiniteQueryOptions<
                TQueryFnData,
                TError,
                TData,
                TQueryFnData,
                TQueryKey,
                TPageParam
            > & // this check if the params can be optional because it require no arguments
                (ArrayContains<UnionToArray<TParams['length']>, 0> extends true
                    ? { params?: TParams }
                    : { params: TParams }),
            'queryKey'
        > & { queryKey?: TQueryKey },
    >(options: Options) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useInfiniteQuery<
            TQueryFnData,
            TError,
            TData,
            TQueryKey,
            TPageParam
        >({
            ...options,
            queryFn: (ctx) =>
                func({
                    ...ctx,
                    params: options.params || [],
                } as FunctionContext<TParams, TPageParam, TQueryKey>),
            queryKey: [...(options.queryKey ?? []), ...(options.params ?? [])],
        }) as Options extends DefinedInitialDataInfiniteOptions<
            TQueryFnData,
            TError,
            TData,
            TQueryKey,
            TPageParam
        >
            ? DefinedUseInfiniteQueryResult<TData, TError>
            : UseInfiniteQueryResult<TData, TError>
    }
}

// const useAdvancedInfiniteUser = toAdvancedUseInfiniteQuery(
//     ({ queryKey: [id], pageParam }: FunctionContext<[id: number], number>) => // here you have to give a type to the pageParam if you want to use it
//         fetch(
//             `https://jsonplaceholder.typicode.com/todos/${id}?_page=${pageParam}`
//         ).then((res) => res.json()) as Promise<{ id: number; title: string }>
// )

// const {data, fetchNextPage} = useAdvancedInfiniteUser({
//     queryKey: [1],
//     params: [1],
//     initialPageParam: 1,
//     getNextPageParam: (lastPage, allPages, lastPageParam) => lastPageParam + 1, // return null if there is no more pages after the actual page
//     getPreviousPageParam: (firstPage, allPages, firstPageParam) => firstPageParam - 1, // return null if there is no more pages before the actual page
// })

// const useAdvancedUser = toAdvancedUseQuery(
//     (
//         { queryKey: [id] }: FunctionContext<[id: number], number>) => // here you have to give a type to the pageParam if you want to use it
//     ) =>
//         fetch(`https://jsonplaceholder.typicode.com/todos/${id}`).then((res) =>
//             res.json()
//         ) as Promise<{ id: number; title: string }>
// )

// const { data: data1 } = useAdvancedUser({
//     queryKey: [1],
//     params: [1],
//     initialData: { id: 1, title: 'test' },
// })

// const useUser = toUseQuery(
//     (
//         id: number // the type of the queryKey is inferred from the function arguments
//     ) =>
//         fetch(`https://jsonplaceholder.typicode.com/todos/${id}`).then((res) =>
//             res.json()
//         ) as Promise<{ id: number; title: string }>
// )

// const { data: data2 } = useUser({
//     queryKey: [1],
//     params: [1],
//     initialData: { id: 1, title: 'test' },
// })

// const useCreateUser = toUseMutation(
//     ({ name }: { name: string }) =>
//         fetch(`https://jsonplaceholder.typicode.com/todos`, {
//             method: 'POST',
//             body: JSON.stringify({ name }),
//         }).then((res) => res.json())
// )

// const { mutate } = useCreateUser({
//     mutationKey: ['createUser'],
// })
