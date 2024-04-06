import { isNumber } from './isNumber'

export function parseNumber(value: unknown): number
export function parseNumber<TFallback>(
	value: unknown,
	fallback: TFallback
): number | (TFallback extends AnyFunction ? ReturnType<TFallback> : TFallback)
export function parseNumber(value: unknown, ...args: [unknown] | []) {
	if (isNumber(value)) {
		return value
	}
	const numeric = parseFloat(String(value || ''))
	if (isNumber(numeric)) {
		return numeric
	}

	if (args.length === 0) {
		throw new Error(
			`Could not parse number from value: ${value}\nof type: ${typeof value}`
		)
	}

	const [fallback] = args

	if (typeof fallback === 'function') {
		return fallback()
	}

	return fallback
}

type AnyFunction = () => any
