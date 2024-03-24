import { randInt } from './randInt.js'

const MAX_ATTEMPTS = 100

type Card = {
	id: string
}

type NonEmptyArray<T> = [T, ...Array<T>]

type Combination<T> = {
	card: T
	upsideDown: boolean
}

type CombinationString = `${string}:${boolean}`

export const pickRandomCard = <
	TCard extends Card,
	TPrev extends Card & { upsideDown: boolean } = Card & {
		upsideDown: boolean
	},
>({
	source,
	prev = [],
}: {
	source: NonEmptyArray<TCard>
	prev?: Array<TPrev>
}): Combination<TCard> => {
	if (!source.length) {
		throw new Error('Nothing to pick from')
	}
	if (!prev.length) {
		return {
			card: source[randInt(0, source.length - 1)]!,
			upsideDown: randInt(0, 1) === 1,
		}
	}

	const prevCombinations = {} as Record<CombinationString, true>
	let historyLimit = Math.max(
		Math.min(source.length - 4, Math.floor(source.length / 2)),
		0
	)
	let combinationsCount = 0
	for (let i = prev.length - 1; i >= 0; i--) {
		if (combinationsCount >= historyLimit) {
			break
		}
		combinationsCount += 1
		const { id } = prev[i]!
		prevCombinations[`${id}:true`] = true
		prevCombinations[`${id}:false`] = true
	}
	const sourceCombinations = {} as Record<CombinationString, true>
	for (let i = 0; i < source.length; i++) {
		const id = source[i]!.id
		const aCombination = `${id}:true` as const
		const bCombination = `${id}:false` as const
		if (
			!prevCombinations[aCombination] &&
			!sourceCombinations[aCombination]
		) {
			sourceCombinations[aCombination] = true
			sourceCombinations[bCombination] = true
		}
	}

	for (let i = 0; i < MAX_ATTEMPTS; i++) {
		const card = source[randInt(0, source.length - 1)]!
		const upsideDown = randInt(0, 1) === 1
		const combination = `${card.id}:${upsideDown}` as const
		if (!prevCombinations[combination]) {
			return {
				card,
				upsideDown,
			}
		}
	}

	const index = randInt(0, source.length - 1)
	let card = source[index]!
	let upsideDown = randInt(0, 1) === 1
	if (prev[prev.length - 1]?.id === card.id) {
		card = source[index % source.length]!
	}
	// Try to avoid same card orientation too much
	if (
		prev.at(-1)?.upsideDown === upsideDown &&
		prev.at(-2)?.upsideDown === upsideDown &&
		prev.at(-3)?.upsideDown
	) {
		upsideDown = randInt(0, 4) > 0 ? !upsideDown : upsideDown
	}

	return {
		card,
		upsideDown,
	}
}
