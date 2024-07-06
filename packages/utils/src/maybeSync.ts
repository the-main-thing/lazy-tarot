export const maybeSync = <TValue, TError = Error>(
	callback: () => TValue
): [value: TValue, error: null] | [value: null, error: TError] => {
	try {
		return [callback(), null]
	} catch (error) {
		return [null, error as TError]
	}
}
