import { DirectusIdType } from '../utils'
import {
    FieldOutputMap,
    FieldsWildcard,
    HasManyToAnyRelation,
    IfAny,
    ItemType,
    Merge,
    Mutable,
    PickRelationalFields,
    RelationNullable,
    UnpackList,
} from '@directus/sdk'

/**
 * Apply the configured fields query parameter on a many to any relation
 */
type ApplyManyToAnyFields<
    Schema,
    JunctionCollection,
    FieldsList,
    Junction = UnpackList<JunctionCollection>,
> = Junction extends object
    ? PickRelationalFields<FieldsList> extends never
        ? ApplyQueryFields<Schema, Junction, Readonly<UnpackList<FieldsList>>>
        : 'item' extends keyof PickRelationalFields<FieldsList>
          ? PickRelationalFields<FieldsList>['item'] extends infer ItemFields
              ? Omit<
                    ApplyQueryFields<
                        Schema,
                        Omit<Junction, 'item'>,
                        Readonly<UnpackList<FieldsList>>
                    >,
                    'item'
                > & {
                    item: {
                        [Scope in keyof ItemFields]: Scope extends keyof Schema
                            ? ApplyNestedQueryFields<
                                  Schema,
                                  Schema[Scope],
                                  ItemFields[Scope]
                              >
                            : never
                    }[keyof ItemFields]
                }
              : never
          : ApplyQueryFields<Schema, Junction, Readonly<UnpackList<FieldsList>>>
    : never
/**
 * wrapper to aid in recursion
 */
type ApplyNestedQueryFields<Schema, Collection, Fields> =
    Collection extends object
        ? ApplyQueryFields<Schema, Collection, Readonly<UnpackList<Fields>>>
        : never
/**
 * Map literal types to actual output types
 */
type MapFlatFields<
    Item extends object,
    Fields extends keyof Item,
    FunctionMap extends Record<string, string>,
> = {
    [F in Fields as F extends keyof FunctionMap
        ? FunctionMap[F]
        : F]: F extends keyof FunctionMap
        ? FunctionOutputType
        : Extract<Item[F], keyof FieldOutputMap> extends infer A
          ? A[] extends never[]
              ? Item[F] extends any[]
                  ? Exclude<Item[F], object[]> // all this code as been change for this line
                  : Exclude<Item[F], object>
              : A extends keyof FieldOutputMap
                ? FieldOutputMap[A] | Exclude<Item[F], A>
                : Item[F]
          : Item[F]
}
/**
 * Extract a specific literal type from a collection
 */
type LiteralFields<Item, Type extends string> = {
    [Key in keyof Item]: Extract<Item[Key], Type>[] extends never[]
        ? never
        : Key
}[keyof Item]
/**
 * Available query functions
 */
type DateTimeFunctions =
    | 'year'
    | 'month'
    | 'week'
    | 'day'
    | 'weekday'
    | 'hour'
    | 'minute'
    | 'second'
type ArrayFunctions = 'count'
type QueryFunctions = {
    datetime: DateTimeFunctions
    json: ArrayFunctions
    csv: ArrayFunctions
}
type FunctionOutputType = number

/**
 * Return string keys of all Relational fields in the given schema Item
 */
type RelationalFields<Schema, Item> = {
    [Key in keyof Item]: Extract<Item[Key], ItemType<Schema>> extends never
        ? never
        : Key
}[keyof Item]
/**
 * Permute [function, field] combinations
 */
type PermuteFields<Fields, Funcs> = Fields extends string
    ? Funcs extends string
        ? [Fields, Funcs]
        : never
    : never
/**
 * Get all many relations on an item
 */
type RelationalFunctions<Schema, Item> = keyof {
    [Key in RelationalFields<Schema, Item> as Extract<
        Item[Key],
        ItemType<Schema>
    > extends any[]
        ? Key
        : never]: Key
}
/**
 * Create a map of function fields and their resulting output names
 */
type TranslateFunctionFields<Fields, Funcs> = {
    [F in PermuteFields<Fields, Funcs> as `${F[1]}(${F[0]})`]: `${F[0]}_${F[1]}`
}

type MappedFunctionFields<Schema, Item> = Merge<
    TranslateFunctionFields<RelationalFunctions<Schema, Item>, ArrayFunctions>,
    TranslateFunctionFields<
        LiteralFields<Item, 'datetime'>,
        DateTimeFunctions
    > &
        TranslateFunctionFields<
            LiteralFields<Item, 'json' | 'csv'>,
            ArrayFunctions
        >
>

type RemoveDuplicateIdAndItem<T> = {
    [Key in keyof T]: Exclude<T[Key], null | undefined> extends any[]
        ? Exclude<T[Key], null | undefined | DirectusIdType[]> extends never
            ? T[Key]
            : Exclude<T[Key], DirectusIdType[]>
        : Exclude<T[Key], null | undefined | DirectusIdType> extends never
          ? T[Key]
          : Exclude<T[Key], DirectusIdType>
}

type ApplyQueryFields<
    Schema,
    Collection extends object,
    ReadonlyFields,
    CollectionItem extends object = UnpackList<Collection>,
    Fields = UnpackList<Mutable<ReadonlyFields>>,
    RelationalFields = PickRelationalFields<Fields>,
    RelationalKeys extends
        keyof RelationalFields = RelationalFields extends never
        ? never
        : keyof RelationalFields,
    FlatFields extends keyof CollectionItem = FieldsWildcard<
        CollectionItem,
        Exclude<Fields, RelationalKeys>
    >,
> = RemoveDuplicateIdAndItem<
    IfAny<
        Schema,
        Record<string, any>,
        Merge<
            MappedFunctionFields<Schema, CollectionItem> extends infer FF
                ? MapFlatFields<
                      CollectionItem,
                      FlatFields,
                      FF extends Record<string, string>
                          ? FF
                          : Record<string, string>
                  >
                : never,
            RelationalFields extends never
                ? never
                : {
                      [Field in keyof RelationalFields]: Field extends keyof CollectionItem
                          ? Extract<
                                CollectionItem[Field],
                                ItemType<Schema>
                            > extends infer RelatedCollection
                              ? RelationNullable<
                                    CollectionItem[Field],
                                    RelatedCollection extends any[]
                                        ? HasManyToAnyRelation<RelatedCollection> extends never
                                            ?
                                                  | ApplyNestedQueryFields<
                                                        Schema,
                                                        RelatedCollection,
                                                        RelationalFields[Field]
                                                    >[]
                                                  | null
                                            : ApplyManyToAnyFields<
                                                  Schema,
                                                  RelatedCollection,
                                                  RelationalFields[Field]
                                              >[]
                                        : ApplyNestedQueryFields<
                                              Schema,
                                              RelatedCollection,
                                              RelationalFields[Field]
                                          >
                                >
                              : never
                          : never
                  }
        >
    >
>

export type {
    ApplyQueryFields,
    ApplyManyToAnyFields,
    ApplyNestedQueryFields,
    MapFlatFields,
    RemoveDuplicateIdAndItem,
}
