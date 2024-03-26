export type EnvKey =
	| 'NODE_ENV'
	| 'API_ENDPOINT'
	| 'DEV_ONLY_API_ENDPOINT'
	| 'PUBLIC_HOST'
export const env = <TGraceful extends boolean = false>(
	key: EnvKey,
	graceful?: TGraceful,
): TGraceful extends true ? string | undefined : string => {
	if (typeof process.env[key] === 'undefined' && !graceful) {
		throw new Error(`Enviromnent varaible ${key} is not defined.`)
	}

	return process.env[key] as string
}
