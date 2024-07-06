import { randInt } from '@repo/utils'

const MAX_HISTORY_SIZE = 20
const MAX_ATTEMPTS = 5000 // to prevent infinite loop

type ID = string | number
interface HistoryEntry<TId extends ID> {
	id: TId
	upsideDown: boolean
}

type SomeArray<T> = Array<T> | ReadonlyArray<T>
type GetCardIdFromSetItem<TCard, TId extends ID> = (card: TCard) => TId

interface Props<TCard, TId extends ID> {
	prevPickedCards: SomeArray<{
		id: TId
		upsideDown: boolean
	}>
	cardsSet: SomeArray<TCard>
	getIdFromSetItem: GetCardIdFromSetItem<TCard, TId>
}

const maxHistorySize = ({
	prevPickedCards,
	cardsSet,
}: Pick<Props<any, any>, 'cardsSet' | 'prevPickedCards'>): number => {
	return Math.min(
		Math.max(cardsSet.length - 1, 0),
		MAX_HISTORY_SIZE,
		prevPickedCards.length
	)
}

const getHistory = <TCard, TId extends ID>({
	prevPickedCards,
	cardsSet,
	getIdFromSetItem,
}: Props<TCard, TId>) => {
	const cardsSetAsSet = new Set<TId>(
		cardsSet.map(card => getIdFromSetItem(card))
	)
	const validIdsHistorySet = new Set<TId>()
	const validHistoryArray: Array<HistoryEntry<TId>> = []
	const historySize = maxHistorySize({ prevPickedCards, cardsSet })
	for (let i = prevPickedCards.length - 1; i >= 0; i--) {
		if (validIdsHistorySet.size >= historySize) {
			break
		}
		const entry = prevPickedCards[i]
		if (cardsSetAsSet.has(entry.id)) {
			validIdsHistorySet.add(entry.id)
			validHistoryArray.push(entry)
		}
	}
	return {
		set: validIdsHistorySet,
		array: validHistoryArray,
	}
}

export const pickRandomCard = <TCard, TId extends ID>(
	props: Props<TCard, TId>
) => {
	const { set: skipIds, array: historyArray } = getHistory(props)
	const { cardsSet, getIdFromSetItem } = props
	try {
		for (let i = 0; i < MAX_ATTEMPTS; i++) {
			const card = cardsSet.at(randInt(0, cardsSet.length - 1))
			if (!card) {
				throw new Error('pick random card error. index out of bounds')
			}
			const id = getIdFromSetItem(card)
			if (!skipIds.has(id)) {
				const pickedCard = { id, upsideDown: Math.random() > 0.5 }
				historyArray.push(pickedCard)
				return [
					null,
					{
						...pickedCard,
						prevPickedCards: historyArray.slice(1),
					},
				] as const
			}
		}
		throw new Error('Too many attempts for picking next card')
	} catch (error) {
		return [error as Error, null] as const
	}
}
