import { setup, assign, createActor, type Snapshot } from 'xstate'

import { pickRandomCard } from './pickRandomCard'
import { randInt } from '@repo/utils'

export type TarotReadingStateSnapshot = Snapshot<typeof tarotReadingMachine>
export type TarotReadingStateActor = ReturnType<typeof createTarotReadingActor>

type HistoryEntryCard = {
	id: string
	upsideDown: boolean
}

interface Card {
	id: string
	upsideDown: boolean
}

type CardsSet =
	| [string, ...Array<string>]
	| Readonly<[string, ...Readonly<Array<string>>]>

interface Context {
	card: Card
	cardsSet: CardsSet
	prevPickedCards: Array<HistoryEntryCard>
}

interface Input {
	card?: Context['card']
	prevPickedCards?: Array<HistoryEntryCard>
	cardsSet: CardsSet
}

export interface TarotReadingStatePersistedSnapshot {
	status: 'active'
	output: undefined
	error: undefined
	value: 'hidden' | 'revealed'
	historyValue: Record<string, unknown>
	context: Context
	children: Record<string, unknown>
}

export const hydrateSnapshot = (
	snapshot: string
): TarotReadingStatePersistedSnapshot => {
	return {
		...JSON.parse(snapshot),
		output: undefined,
		error: undefined,
	}
}

export const getPersistedSnapshot = (
	actor: ReturnType<typeof createTarotReadingActor>
): string => {
	const snapshot =
		actor.getPersistedSnapshot() as TarotReadingStatePersistedSnapshot
	return JSON.stringify({
		...snapshot,
		context: {
			...snapshot.context,
			cardsSet: [snapshot.context.cardsSet[0]],
		},
	})
}

export const tarotReadingMachine = setup({
	types: {
		input: {} as Input,
		context: {} as Context,
		events: {} as
			| {
					type: 'REVEAL'
			  }
			| {
					type: 'HIDE'
					prevPickedCards: Array<HistoryEntryCard>
					cardsSet: CardsSet
			  }
			| {
					type: 'CONTENT_HIDDEN'
			  }
			| {
					type: 'CARD_FLIPPED'
			  }
			| {
					type: 'DECK_ARRIVED_AT_POSITION'
			  }
			| {
					type: 'CONTENT_REVEALED'
			  },
	},
	guards: {
		shouldAnimate: () => {
			return typeof window !== 'undefined'
		},
	},
	actions: {
		setHistoryAndSet: assign({
			prevPickedCards: ({ context, event }) => {
				if ('prevPickedCards' in event) {
					return event.prevPickedCards
				}
				return context.prevPickedCards
			},
			cardsSet: ({ context, event }) => {
				if ('cardsSet' in event) {
					return event.cardsSet
				}

				return context.cardsSet
			},
		}),
		pickNextCard: assign(({ context }) => {
			const [error, output] = pickRandomCard({
				...context,
				getIdFromSetItem: id => id,
			})

			if (error) {
				throw error
			}
			return {
				...context,
				...output,
			}
		}),
	},
}).createMachine({
	id: 'tarotReadingMachine',
	initial: 'hidden',
	context: ({ input }) => {
		const { cardsSet, prevPickedCards, card } = input
		if (cardsSet.length < 1) {
			throw new Error('Cards set cannot be empty')
		}
		if (!card) {
			const id = input.cardsSet[randInt(0, cardsSet.length - 1)]
			if (!id) {
				throw new Error('randInt error. index out of bounds')
			}
			const pickedCard = {
				id,
				upsideDown: Math.random() > 0.5,
			}
			return {
				cardsSet,
				card: pickedCard,
				prevPickedCards: prevPickedCards?.concat(pickedCard) || [
					pickedCard,
				],
			}
		}
		if (prevPickedCards?.at(-1)?.id !== card.id) {
			return {
				cardsSet,
				card,
				prevPickedCards: prevPickedCards?.concat(card) || [card],
			}
		}

		return {
			cardsSet,
			card,
			prevPickedCards,
		}
	},
	states: {
		hidden: {
			on: {
				REVEAL: [
					{
						target: 'revealing',
						guard: 'shouldAnimate',
					},
					{
						target: 'revealed',
					},
				],
			},
		},
		revealing: {
			initial: 'hidingContent',
			states: {
				hidingContent: {
					on: {
						HIDE: {
							target: '#tarotReadingMachine.hiding.revealingContent',
						},
						CONTENT_HIDDEN: {
							target: 'flippingCard',
						},
					},
				},
				flippingCard: {
					on: {
						HIDE: {
							target: '#tarotReadingMachine.hiding.flippingCard',
							actions: ['setHistoryAndSet'],
						},
						CARD_FLIPPED: {
							target: 'movingDeck',
						},
					},
				},
				movingDeck: {
					on: {
						HIDE: {
							target: '#tarotReadingMachine.hiding.movingDeck',
							actions: ['setHistoryAndSet'],
						},
						DECK_ARRIVED_AT_POSITION: {
							target: 'revealingContent',
						},
					},
				},
				revealingContent: {
					on: {
						HIDE: {
							target: '#tarotReadingMachine.hiding.hidingContent',
							actions: ['setHistoryAndSet'],
						},
						CONTENT_REVEALED: {
							target: '#tarotReadingMachine.revealed',
						},
					},
				},
			},
		},
		hiding: {
			initial: 'hidingContent',
			states: {
				hidingContent: {
					on: {
						REVEAL: {
							target: '#tarotReadingMachine.revealing.revealingContent',
						},
						CONTENT_HIDDEN: {
							target: 'flippingCard',
						},
					},
				},
				flippingCard: {
					on: {
						REVEAL: {
							target: '#tarotReadingMachine.revealing.flippingCard',
						},
						CARD_FLIPPED: {
							target: 'movingDeck',
						},
					},
				},
				movingDeck: {
					exit: ['pickNextCard'],
					on: {
						REVEAL: {
							target: '#tarotReadingMachine.revealing.movingDeck',
						},
						DECK_ARRIVED_AT_POSITION: {
							target: 'revealingContent',
						},
					},
				},
				revealingContent: {
					on: {
						REVEAL: {
							target: '#tarotReadingMachine.revealing.hidingContent',
						},
						CONTENT_REVEALED: {
							target: '#tarotReadingMachine.hidden',
						},
					},
				},
			},
		},
		revealed: {
			on: {
				HIDE: [
					{
						target: 'hiding',
						guard: 'shouldAnimate',
						actions: ['setHistoryAndSet'],
					},
					{
						target: 'hidden',
					},
				],
			},
		},
	},
})

export interface CreateTarotReadingActorProps
	extends Omit<Input, 'prevPickedCards' | 'card'> {
	prevPickedCards?: Input['prevPickedCards']
	card?: Input['card']
	snapshot?: string
}

export const createTarotReadingActor = ({
	cardsSet,
	prevPickedCards,
	card,
	snapshot,
}: CreateTarotReadingActorProps) => {
	return createActor(tarotReadingMachine, {
		input: {
			cardsSet,
			prevPickedCards,
			card,
		},
		snapshot: snapshot ? hydrateSnapshot(snapshot) : undefined,
	})
}
