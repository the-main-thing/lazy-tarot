import { useState } from 'react'

/**
 * Only pass memoized values here.
 * Otherwise, it will cause an infinite loop.
 */
export const useOptimistic = <T>(value: T) => {
	const [prevValue, setPrevValue] = useState(() => value)
	const [optimistic, setOptimistic] = useState(() => value)

	if (prevValue !== value && optimistic !== value) {
		setPrevValue(() => value)
		setOptimistic(() => value)
	}

	return [optimistic, setOptimistic] as const
}
