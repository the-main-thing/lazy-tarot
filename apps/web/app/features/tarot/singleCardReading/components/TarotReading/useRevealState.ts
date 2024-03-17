/* eslint-disable no-mixed-spaces-and-tabs */
import { useReducer, useCallback } from 'react'

export type RevealState =
	| {
			value: 'initial_revealed'
	  }
	| {
			value: 'initial_hidden'
	  }
	| {
			value: 'pre_reveal'
	  }
	| {
			value: 'pre_hide'
	  }
	| {
			value: 'reveal'
	  }
	| {
			value: 'hide'
	  }
	| {
			value: 'revealed'
	  }
	| {
			value: 'hidden'
	  }

export type RevealEvent =
	| {
			type: 'PRE_COMPLETED'
	  }
	| {
			type: 'REVEAL'
	  }
	| {
			type: 'HIDE'
	  }
	| {
			type: 'COMPLETED'
	  }
	| {
			type: 'TOGGLE'
	  }

type Machine = {
	[state in RevealState['value']]: {
		[event in Event['type']]?: (
			state: Extract<RevealState, { value: state }>,
			event: Extract<RevealEvent, { type: event }>,
		) => RevealState
	}
}

const machine: Machine = {
	initial_hidden: {
		REVEAL: () => ({ value: 'pre_reveal' }),
		TOGGLE: () => ({ value: 'pre_reveal' }),
	},
	initial_revealed: {
		HIDE: () => ({ value: 'pre_hide' }),
		TOGGLE: () => ({ value: 'pre_hide' }),
	},
	revealed: {
		HIDE: () => ({ value: 'pre_hide' }),
		TOGGLE: () => ({ value: 'pre_hide' }),
	},
	hidden: {
		REVEAL: () => ({ value: 'reveal' }),
		TOGGLE: () => ({ value: 'reveal' }),
	},
	pre_reveal: {
		PRE_COMPLETED: () => ({ value: 'reveal' }),
		HIDE: () => ({ value: 'hide' }),
		TOGGLE: () => ({ value: 'hidden' }),
	},
	pre_hide: {
		PRE_COMPLETED: () => ({ value: 'hide' }),
		REVEAL: () => ({ value: 'reveal' }),
		TOGGLE: () => ({ value: 'reveal' }),
	},
	hide: {
		COMPLETED: () => ({ value: 'hidden' }),
		REVEAL: () => ({ value: 'reveal' }),
		TOGGLE: () => ({ value: 'reveal' }),
	},
	reveal: {
		COMPLETED: () => ({ value: 'revealed' }),
		HIDE: () => ({ value: 'hide' }),
		TOGGLE: () => ({ value: 'hide' }),
	},
}

const transition = (state: RevealState, event: RevealEvent): RevealState => {
	return (
		machine[state.value][event.type]?.(state as never, event as never) ||
		state
	)
}

const getInitialState = <TInitialRevealed extends boolean>(
	initialRevealed: TInitialRevealed,
): TInitialRevealed extends true
	? Extract<RevealState, { value: 'initial_revealed' }>
	: Extract<RevealState, { value: 'initial_hidden' }> => {
	return (
		initialRevealed
			? {
					value: 'initial_revealed',
			  }
			: {
					value: 'initial_hidden',
			  }
	) as never
}

export const useRevealState = <TInitialRevealed extends boolean>(
	initialRevealed: TInitialRevealed,
) => {
	const [state, send] = useReducer(
		transition,
		initialRevealed,
		getInitialState,
	)
	return [
		state,
		useCallback((event: RevealEvent) => send(event), []),
	] as const
}

export const hiddenState = {
	initial_hidden: true,
	hidden: true,
	pre_reveal: true,
	reveal: true,
	pre_hide: false,
	hide: false,
	revealed: false,
	initial_revealed: false,
} as const satisfies {
	[state in RevealState['value']]: boolean
}

export type Send = ReturnType<typeof useRevealState>[1]

export const stateToCardState = {
	initial_hidden: 'hidden',
	hidden: 'hidden',
	pre_reveal: 'hidden',
	reveal: 'reveal',
	hide: 'hide',
	pre_hide: 'revealed',
	revealed: 'revealed',
	initial_revealed: 'revealed',
} as const
