declare type OmitFromUnion<TUnion, TWhatToOmit> = TUnion extends TWhatToOmit
	? never
	: TUnion

declare type AnyFunction = (...args: Array<any>) => any
declare type AsyncAnyFunction = (...args: Array<any>) => Promise<any>
declare type NonEmptyArray<T> = [T, ...T[]]
declare type RemoveFirstElement<T extends Array<any>> = T extends [
	infer _First,
	...infer Rest,
]
	? Rest
	: never

declare type Integer<T extends number = number> =
	`${T}` extends `${string}.${string}` ? never : T

declare type Float<T extends number = number> =
	`${T}` extends `${string}.${string}` ? T : never

declare type ValueOf<T extends object, TKey extends keyof T = keyof T> = T[TKey]

declare type Compatible<T, U> = T extends U ? T : never

declare interface SearchParams<TData> {
	serialize: (data: TData, searchParams?: URLSearchParams) => URLSearchParams
	deserialize: (searchParams: URLSearchParams) => TData | undefined
}
