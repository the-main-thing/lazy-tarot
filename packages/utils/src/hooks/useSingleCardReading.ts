import { z } from 'zod'
import { useEffect, useState, useReducer, useCallback } from 'react'
import { equals } from 'remeda'
import { pickRandomCard } from '../pickRandomCard.js'

type NonEmptyArray<T> = [T, ...Array<T>]

const pickedCardSchema = z.object({
	id: z.string().min(1),
	upsideDown: z.boolean(),
})
const storageSchema = z.object({
	history: z.array(pickedCardSchema),
})

type PickedCard = z.infer<typeof pickedCardSchema>
type PickedCardWithContent<T extends { id: string }> = {
	card: T
	upsideDown: boolean
}
type StorageValue = z.infer<typeof storageSchema>

type Storage = {
	getItem: (key: string) => string | null
	setItem: (key: string, value: string) => void
}

type Props<T extends { id: string }> = {
	cardsSet: NonEmptyArray<T>
	initialPickedCard: PickedCard | null
	storage: Storage
	storageKey: string
}

const parseStorage = (key: string, storage: Storage): StorageValue => {
	const saved = storage.getItem(key)
	try {
		return saved
			? {
					history: JSON.parse(saved).history.filter(
						(pickedCard: unknown) =>
							pickedCardSchema.parse(pickedCard)
					),
				}
			: { history: [] }
	} catch {
		return { history: [] }
	}
}

const withContent = <T extends { id: string }>({
	card,
	cardsSet,
}: {
	card: PickedCard
	cardsSet: NonEmptyArray<T>
}): PickedCardWithContent<T> | undefined => {
	const content = cardsSet.find(({ id }) => id === card.id)
	if (!content) {
		return undefined
	}
	return {
		card: content,
		upsideDown: card.upsideDown,
	}
}

type State<T extends { id: string }> =
	| {
			value: 'loading'
			card: PickedCardWithContent<T> | undefined
			history: Array<PickedCard> | undefined
			nextCard: PickedCardWithContent<T> | undefined
			cardsSet: NonEmptyArray<T>
	  }
	| {
			value: 'ready'
			card: PickedCardWithContent<T>
			history: Array<PickedCard>
			nextCard: PickedCardWithContent<T>
			cardsSet: NonEmptyArray<T>
	  }

type Event<T extends { id: string }> =
	| {
			type: 'HYDRATED'
	  }
	| {
			type: 'LOADED'
			data: {
				cardsSet: NonEmptyArray<T>
				card: PickedCardWithContent<T>
				nextCard: PickedCardWithContent<T>
				history: Array<PickedCard>
			}
	  }
	| {
			type: 'SET_HISTORY'
			data: Array<PickedCard>
	  }
	| {
			type: 'SET_NEXT_CARD'
			data: PickedCard
	  }
	| {
			type: 'SET_CARD'
			data: PickedCard
	  }
	| {
			type: 'PICK_NEXT_CARD'
			history: Array<PickedCard> | undefined
	  }
	| {
			type: 'SET_CARDS_SET'
			data: NonEmptyArray<T>
	  }

const getMachine = <T extends { id: string }>() => {
	const onPickNextCard = (
		state: State<T>,
		event: Extract<Event<T>, { type: 'PICK_NEXT_CARD' }>
	): State<T> => {
		const history = event.history || state.history || []

		let nextCard: NonNullable<typeof state.card> = pickRandomCard({
			prev: history,
			source: state.cardsSet,
		})

		history.push({
			id: nextCard.card.id,
			upsideDown: nextCard.upsideDown,
		})

		let card = state.nextCard
		if (!card) {
			card = nextCard
			nextCard = pickRandomCard({
				prev: history,
				source: state.cardsSet,
			})
		}

		return {
			...state,
			history,
			card,
			nextCard,
		}
	}

	const machine: {
		[stateValue in State<T>['value']]: {
			[eventType in Event<T>['type']]?: (
				state: Extract<State<T>, { value: stateValue }>,
				event: Extract<Event<T>, { type: eventType }>
			) => State<T>
		}
	} = {
		loading: {
			SET_CARDS_SET: (state, event) =>
				state.cardsSet === event.data
					? state
					: {
							...state,
							cardsSet: event.data,
						},
			SET_HISTORY: (state, event) => {
				if (state.history === event.data) {
					return state
				}
				if (state.card && state.nextCard) {
					return {
						...state,
						value: 'ready',
						history: event.data,
						card: state.card as NonNullable<typeof state.card>,
						nextCard: state.nextCard as NonNullable<
							typeof state.nextCard
						>,
					}
				}

				return {
					...state,
					history: event.data,
				}
			},
			LOADED: (state, event) => ({
				...state,
				...event.data,
				value: 'ready',
			}),
		},
		ready: {
			SET_CARD: (state, event) => {
				if (
					state.card.card.id === event.data.id &&
					state.card.upsideDown === event.data.upsideDown
				) {
					return state
				}
				const card = withContent({
					card: event.data,
					cardsSet: state.cardsSet,
				})
				if (!card) {
					return state
				}

				let nextCard = state.nextCard
				if (
					nextCard.card.id === event.data.id &&
					nextCard.upsideDown === event.data.upsideDown
				) {
					nextCard = pickRandomCard({
						prev: state.history,
						source: state.cardsSet,
					})
				}

				return {
					...state,
					card,
					nextCard,
				}
			},
			SET_NEXT_CARD: (state, event) => {
				if (
					state.nextCard.card.id === event.data.id &&
					state.nextCard.upsideDown === event.data.upsideDown
				) {
					return state
				}
				if (
					state.card.card.id === event.data.id &&
					state.card.upsideDown === event.data.upsideDown
				) {
					return state
				}
				const nextCard = withContent({
					card: event.data,
					cardsSet: state.cardsSet,
				})
				if (!nextCard) {
					return state
				}

				return {
					...state,
					nextCard,
				}
			},
			PICK_NEXT_CARD: onPickNextCard,
			SET_CARDS_SET: (state, event) =>
				state.cardsSet === event.data
					? state
					: {
							...state,
							cardsSet: event.data,
						},
			SET_HISTORY: (state, event) =>
				equals(state.history, event.data)
					? state
					: {
							...state,
							history: event.data,
						},
		},
	}

	return machine
}

const getReducer = <T extends { id: string }>() => {
	const machine = getMachine<T>()

	return (state: State<T>, event: Event<T>): State<T> => {
		const handler = machine[state.value][event.type]
		if (handler) {
			return handler(state as never, event as never)
		}

		return state
	}
}

const getInitialState = <T extends { id: string }>({
	cardsSet,
	initialPickedCard,
}: Pick<Props<T>, 'initialPickedCard' | 'cardsSet'>): State<T> => {
	const card = initialPickedCard
		? withContent({
				card: initialPickedCard,
				cardsSet,
			})
		: undefined

	return {
		value: 'loading',
		card,
		cardsSet,
		history: undefined,
		nextCard: undefined,
	}
}

export const useSingleCardReading = <T extends { id: string }>({
	cardsSet,
	initialPickedCard,
	storage,
	storageKey,
}: Props<T>) => {
	const [reducer] = useState(() => getReducer<T>())
	const [state, send] = useReducer(
		reducer,
		{ cardsSet, initialPickedCard },
		getInitialState
	)

	const stateValue = state.value

	useEffect(() => {
		send({ type: 'SET_CARDS_SET', data: cardsSet })
	}, [cardsSet])

	useEffect(() => {
		if (stateValue === 'loading' && cardsSet.length) {
			const frameId = window.requestAnimationFrame(() => {
				const history = parseStorage(storageKey, storage).history || []
				let card = initialPickedCard
					? withContent({ card: initialPickedCard, cardsSet })
					: undefined
				if (!card) {
					card = pickRandomCard({
						prev: history,
						source: cardsSet,
					})
				}
				const nextCard = pickRandomCard({
					prev: [
						...history,
						{
							id: card.card.id,
							upsideDown: card.upsideDown,
						},
					],
					source: cardsSet,
				})
				send({
					type: 'LOADED',
					data: {
						history,
						cardsSet: cardsSet,
						card,
						nextCard,
					},
				})
			})

			return () => {
				window.cancelAnimationFrame(frameId)
			}
		}
	}, [stateValue, cardsSet, initialPickedCard, storage, storageKey])

	const history = 'history' in state ? state.history : undefined
	useEffect(() => {
		if (history && storage) {
			const idleId = window.requestIdleCallback(() => {
				storage.setItem(storageKey, JSON.stringify({ history }))
			})

			return () => {
				window.cancelIdleCallback(idleId)
			}
		}
	}, [history, storage, storageKey])

	const pickNextCard = useCallback(() => {
		send({
			type: 'PICK_NEXT_CARD',
			history: storage
				? parseStorage(storageKey, storage).history
				: undefined,
		})
	}, [])

	return {
		card: state.card,
		nextCard: state.nextCard,
		pickNextCard,
	}
}
