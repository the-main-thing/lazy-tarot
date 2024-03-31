import { useReducer, useEffect, useRef, useMemo } from 'react'
import { requestIdleCallback } from '@repo/utils/requestIdleCallback'
import { pickRandomCard } from '@repo/core/pickRandomCard'

import type { PickedCard, Card } from '../types'
import type { LoaderData } from './loader.server'

type CardsHistory = Array<{ id: string; upsideDown: boolean }>

export type State =
	| {
			value: 'error'
			card: null
			nextCard: null
	  }
	| {
			value: 'initial_hidden'
			card: PickedCard
			nextCard: null | PickedCard
			history: CardsHistory
	  }
	| {
			value: 'initial_revealed'
			card: PickedCard
			nextCard: null | PickedCard
			history: CardsHistory
	  }
	| {
			value: 'pre_reveal'
			card: PickedCard
			nextCard: PickedCard
			history: CardsHistory
	  }
	| {
			value: 'pre_hide'
			card: PickedCard
			nextCard: PickedCard
			history: CardsHistory
	  }
	| {
			value: 'revealing'
			card: PickedCard
			nextCard: PickedCard
			history: CardsHistory
	  }
	| {
			value: 'revealed'
			card: PickedCard
			nextCard: PickedCard
			history: CardsHistory
	  }
	| {
			value: 'hiding'
			card: PickedCard
			nextCard: PickedCard
			history: CardsHistory
	  }
	| {
			value: 'hidden'
			card: PickedCard
			nextCard: PickedCard
			history: CardsHistory
	  }

type Event =
	| {
			type: 'INIT_ON_CLIENT'
			history: CardsHistory
			cardsSet: NonEmptyArray<Card>
	  }
	| {
			type: 'REVEAL'
			history: CardsHistory
			cardsSet: NonEmptyArray<Card>
	  }
	| {
			type: 'HIDE'
			history: CardsHistory
			cardsSet: NonEmptyArray<Card>
	  }
	| {
			type: 'PRE_REVEAL_END'
	  }
	| {
			type: 'PRE_HIDE_END'
			history: CardsHistory
			cardsSet: NonEmptyArray<Card>
	  }
	| {
			type: 'REVEALED'
	  }
	| {
			type: 'HIDDEN'
	  }
	| {
			type: 'RESET'
			history: CardsHistory
			cardsSet: NonEmptyArray<Card>
	  }

type Machine = {
	[stateValue in State['value']]: {
		[eventType in Event['type']]?: (
			state: Extract<State, { value: stateValue }>,
			event: Extract<Event, { type: eventType }>,
		) => State
	}
}

const appendHistory = (history: CardsHistory, card: PickedCard) => {
	return history.concat([
		{
			id: card.card.id,
			upsideDown: card.upsideDown,
		},
	])
}

const pick = (
	history: CardsHistory,
	cardsSet: NonEmptyArray<Card>,
	card: PickedCard | null,
) => {
	if (!card) {
		card = pickRandomCard({
			prev: history,
			source: cardsSet,
		})
	}
	const nextCard = pickRandomCard({
		prev: appendHistory(history, card),
		source: cardsSet,
	})

	return { card, nextCard, history }
}

const onReset = (
	state: State,
	{ history, cardsSet }: Extract<Event, { type: 'RESET' }>,
): State => {
	if (state.value === 'error' || state.value === 'initial_hidden') {
		return state
	}

	return {
		value: 'hidden',
		...pick(history, cardsSet, state.nextCard || state.card),
	}
}

const machine: Machine = {
	error: {
		INIT_ON_CLIENT: (state, { history, cardsSet }) => {
			return {
				...state,
				value: 'initial_hidden',
				...pick(history, cardsSet, null),
			}
		},
	},
	initial_hidden: {
		REVEAL: (state, { history, cardsSet }) =>
			state.nextCard
				? {
						...state,
						nextCard: state.nextCard as NonNullable<
							(typeof state)['nextCard']
						>,
						value: 'pre_reveal',
				  }
				: {
						...state,
						value: 'pre_reveal',
						...pick(history, cardsSet, null),
				  },
		INIT_ON_CLIENT: (state, { history, cardsSet }) => ({
			...state,
			...pick(history, cardsSet, null),
		}),
	},
	hidden: {
		REVEAL: (state) => ({
			...state,
			value: 'pre_reveal',
		}),
	},
	pre_reveal: {
		PRE_REVEAL_END: (state) => ({
			...state,
			value: 'revealing',
		}),
		RESET: onReset,
	},
	revealing: {
		REVEALED: (state) => ({
			...state,
			value: 'revealed',
		}),
		RESET: onReset,
	},
	revealed: {
		HIDE: (state) => ({
			...state,
			value: 'pre_hide',
		}),
		RESET: onReset,
	},
	initial_revealed: {
		HIDE: (state, { history, cardsSet }) =>
			state.nextCard
				? {
						...state,
						nextCard: state.nextCard as NonNullable<
							typeof state.nextCard
						>,
						value: 'pre_hide',
				  }
				: {
						...state,
						...pick(history, cardsSet, state.card),
						value: 'pre_hide',
				  },
		INIT_ON_CLIENT: (state, { history, cardsSet }) => ({
			...state,
			...pick(history, cardsSet, state.card),
		}),
		RESET: onReset,
	},
	pre_hide: {
		PRE_HIDE_END: (state, { history, cardsSet }) => {
			return {
				...state,
				...pick(history, cardsSet, state.nextCard),
				value: 'hiding',
			}
		},
	},
	hiding: {
		HIDDEN: (state) => ({
			...state,
			value: 'hidden',
		}),
	},
}

function transition(state: State, event: Event): State {
	return (
		machine[state.value][event.type]?.(state as never, event as never) ||
		state
	)
}

const getInitialState = ({
	revealed,
	card,
}: Pick<LoaderData, 'card' | 'revealed'>): State => {
	if (!card) {
		return {
			value: 'error',
			card: null,
			nextCard: null,
		}
	}

	return {
		value: revealed ? 'initial_revealed' : 'initial_hidden',
		card,
		nextCard: null,
		history: [],
	}
}

const VOID_FUNCTION: VoidFunction = () => void 0
const dummyHandlers = {
	onReveal: VOID_FUNCTION,
	onRevealed: VOID_FUNCTION,
	onHidden: VOID_FUNCTION,
	onHide: VOID_FUNCTION,
	onPreRevealEnd: VOID_FUNCTION,
	onPreHideEnd: VOID_FUNCTION,
	onReset: VOID_FUNCTION,
} as const

export const useStateMachine = ({
	revealed,
	cardsSet,
	card,
	getHistory,
	setHistory,
}: {
	revealed: boolean
	cardsSet: Array<Card> | undefined
	card: PickedCard | null
	getHistory: () => CardsHistory
	setHistory: (history: CardsHistory) => void
}) => {
	const [state, send] = useReducer(
		transition,
		{
			revealed,
			card,
		},
		getInitialState,
	)

	const historyRef = useRef({
		getHistory,
		setHistory,
	})
	historyRef.current.getHistory = getHistory
	historyRef.current.setHistory = setHistory

	const stateValue = state.value
	useEffect(() => {
		if (
			stateValue !== 'error' &&
			stateValue !== 'initial_hidden' &&
			stateValue !== 'initial_revealed'
		) {
			return
		}
		if (card && cardsSet?.length) {
			send({
				type: 'INIT_ON_CLIENT',
				cardsSet: cardsSet as NonEmptyArray<(typeof cardsSet)[number]>,
				history: historyRef.current.getHistory(),
			})
		}
	}, [cardsSet, card, stateValue])

	const history = 'history' in state ? state.history : null
	useEffect(() => {
		if (history && cardsSet?.length) {
			requestIdleCallback(() => {
				historyRef.current.setHistory(
					history.slice(-1 * Math.max(cardsSet.length - 2, 0)),
				)
			})
		}
	}, [history, cardsSet])

	const handles = useMemo<typeof dummyHandlers>(() => {
		if (cardsSet?.length) {
			return {
				onReveal: () => {
					send({
						type: 'REVEAL',
						cardsSet: cardsSet as NonEmptyArray<
							(typeof cardsSet)[number]
						>,
						history: historyRef.current.getHistory(),
					})
				},
				onHide: () => {
					send({
						type: 'HIDE',
						cardsSet: cardsSet as NonEmptyArray<
							(typeof cardsSet)[number]
						>,
						history: historyRef.current.getHistory(),
					})
				},
				onPreHideEnd: () => {
					send({
						type: 'PRE_HIDE_END',
						cardsSet: cardsSet as NonEmptyArray<
							(typeof cardsSet)[number]
						>,
						history: historyRef.current.getHistory(),
					})
				},
				onPreRevealEnd: () => {
					send({
						type: 'PRE_REVEAL_END',
					})
				},
				onRevealed: () => {
					send({ type: 'REVEALED' })
				},
				onHidden: () => {
					send({ type: 'HIDDEN' })
				},
				onReset: () => {
					send({
						type: 'RESET',
						cardsSet: cardsSet as NonEmptyArray<
							(typeof cardsSet)[number]
						>,
						history: historyRef.current.getHistory(),
					})
				},
			}
		}
		return dummyHandlers
	}, [cardsSet])

	return [state, handles] as const
}
