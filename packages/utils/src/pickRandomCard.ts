import { randInt } from './randInt.js'

type Card = {
	id: string
}

type NonEmptyArray<T> = [T, ...Array<T>]
type CombinationKey = `${string}:${boolean}`

const MIN_PREV_CARD_PICKING_CHANCE = 0.05

type Combination<T> = {
	card: T
	upsideDown: boolean
}

const getPrevChance = (prev: number, next: number): number => {
	const total = prev + next
	const result = Math.max(
		prev / Math.max(total * next, total),
		MIN_PREV_CARD_PICKING_CHANCE
	)
	if (next && result === 1) {
		return 0.9
	}
	return result
}

const pickFromPrevious = <
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
}): {
	card: TCard
	upsideDown: boolean
} => {
	if (!prev.length) {
		return {
			card: source[randInt(0, source.length - 1)]!,
			upsideDown: randInt(0, 1) === 1,
		}
	}
	const { id } = prev[randInt(0, prev.length - 1)]!
	const card = source.find(card => card.id === id)
	if (!card) {
		return pickFromPrevious({ source, prev: prev.slice(1) })
	}

	return { card, upsideDown: randInt(0, 1) === 1 }
}

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
	if (!prev.length && !source.length) {
		throw new Error('Nothing to pick from')
	}
	if (!prev.length) {
		return {
			card: source[randInt(0, source.length - 1)]!,
			upsideDown: randInt(0, 1) === 1,
		}
	}
	if (!source.length) {
		return pickFromPrevious({ prev, source })
	}
	const prevCombinationsSet = new Set<CombinationKey>(
		prev.map(({ id, upsideDown }) => `${id}:${upsideDown}` as const)
	)
	const sourceCombinationsKeys = new Set<CombinationKey>()
	for (const card of source) {
		const aCombination = `${card.id}:true` as const
		const bCombination = `${card.id}:false` as const
		if (
			!prevCombinationsSet.has(aCombination) &&
			!sourceCombinationsKeys.has(aCombination)
		) {
			sourceCombinationsKeys.add(aCombination)
		}
		if (
			!prevCombinationsSet.has(bCombination) &&
			!sourceCombinationsKeys.has(bCombination)
		) {
			sourceCombinationsKeys.add(bCombination)
		}
	}
	const chanceOfPickingPrevCard = getPrevChance(
		prevCombinationsSet.size,
		sourceCombinationsKeys.size
	)
	const pickPrevCard =
		randInt(0, Math.round(100 / chanceOfPickingPrevCard) - 100) === 0
	if (pickPrevCard || !sourceCombinationsKeys.size) {
		return pickFromPrevious({ prev, source })
	}

	return {
		card: source[randInt(0, source.length - 1)]!,
		upsideDown: randInt(0, 1) === 1,
	}
}
