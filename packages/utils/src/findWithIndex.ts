export const findWithIndex = <T>(
	array: Array<T>,
	predicate: (value: T) => boolean
): [value: T | undefined, index: number] => {
	for (let i = 0; i < array.length; i++) {
		if (predicate(array[i]!)) {
			return [array[i], i]
		}
	}
	return [undefined, NaN]
}
