declare type NonEmptyArray<T> = [T, ...T[]]
declare type ValueOf<T extends object, TKey extends keyof T = keyof T> = T[TKey]
declare const __API_KEY__: string
declare const __BUILD_TIMESTAMP__: string
