import { randInt } from './randInt.js'

type Card = {
	id: string
}

type NonEmptyArray<T> = [T, ...Array<T>]
type CombinationKey = `${string}:${boolean}`

type Combination<T> = {
	card: T
	upsideDown: boolean
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

	if (prev.length >= source.length) {
		// Allow 4 oldest cards to be picked
		// If there is no such amount of cards, then just increase chance for a single card
		prev = prev.slice(
			Math.min(Math.min(4, source.length - 1), prev.length - 1)
		)
	}
	prev =
		prev.length >= source.length
			? prev.slice(Math.floor(source.length / 4))
			: prev
	const prevCombinationsSet = new Set<CombinationKey>()
	for (const { id } of prev) {
		// Ignore upsideDown so there will be no situation when
		// new card is just the turned over old one
		prevCombinationsSet.add(`${id}:true`)
		prevCombinationsSet.add(`${id}:false`)
	}
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

	return {
		card: source[randInt(0, source.length - 1)]!,
		upsideDown: randInt(0, 1) === 1,
	}
}
