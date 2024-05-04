import { useState, useReducer, useEffect } from 'react'

export type Position = {
	x: number
	y: number
	width: number
	height: number
}

const getScrollY = () =>
	[
		document.body.scrollTop,
		document.documentElement.scrollTop,
		window.scrollY,
	].filter(Boolean)[0] || 0
const getScrollX = () =>
	[
		document.body.scrollLeft,
		document.documentElement.scrollLeft,
		window.scrollX,
	].filter(Boolean)[0] || 0
const getClientTop = () =>
	[document.body.clientTop, document.documentElement.clientTop].filter(
		Boolean,
	)[0] || 0
const getClientLeft = () =>
	[document.body.clientLeft, document.documentElement.clientLeft].filter(
		Boolean,
	)[0] || 0

export const fromRect = (rect: DOMRect): Rect => {
	const scrollTop = getScrollY()
	const scrollLeft = getScrollX()

	const clientTop = getClientTop()
	const clientLeft = getClientLeft()

	return {
		x: rect.left + scrollLeft - clientLeft,
		y: rect.top + scrollTop - clientTop,
		width: rect.width,
		height: rect.height,
	}
}

export const fromElement = (element: Element): Rect =>
	fromRect(element.getBoundingClientRect())

export const equals = (a: Position, b: Position) =>
	a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height

interface Transform {
	x: number
	y: number
	scale: number
}

interface Rect {
	x: number
	y: number
	width: number
	height: number
}

type State =
	| {
			value: 'initial'
	  }
	| {
			value: 'idle'
			initialRect: Rect
			transform: Transform
	  }
	| {
			value: 'mooving'
			initialRect: Rect
			targetRect: Rect
			transform: Transform
	  }
	| {
			value: 'syncing'
			initialRect: Rect
			targetRect: Rect | null
			transform: Transform
	  }
	| {
			value: 'hidden'
			initialRect: Rect
			transform: Transform
	  }

type Event =
	| {
			type: 'SET_TARGET_RECT'
			payload: Rect | null
	  }
	| {
			type: 'ARRIVED'
	  }
	| {
			type: 'SYNC'
			payload: { initialRect: Rect; targetRect: Rect | null }
	  }

const getScale = (
	from: Pick<Rect, 'width' | 'height'>,
	to: Pick<Rect, 'width' | 'height'>,
): number => {
	const xDiff = to.width - from.width
	const yDiff = to.height - from.height
	const diffKey: keyof typeof from = xDiff > yDiff ? 'width' : 'height'
	if (from[diffKey] <= 0) {
		return 1
	}
	if (to[diffKey] <= 0) {
		return 0
	}

	return from[diffKey] / to[diffKey]
}

const transform = (from: Rect, to: Rect): Transform => {
	return {
		x: to.x - from.x,
		y: to.y - from.y,
		scale: getScale(from, to),
	}
}

const machine: {
	[state in State['value']]: {
		[event in Event['type']]?: (
			state: Extract<State, { value: state }>,
			event: Extract<Event, { type: event }>,
		) => State
	}
} = {
	initial: {
		SYNC: (_, { payload }) => {
			return {
				value: 'syncing',
				initialRect: payload.initialRect,
				targetRect: payload.targetRect,
				transform: transform(
					payload.initialRect,
					payload.targetRect || payload.initialRect,
				),
			}
		},
	},
	idle: {
		SET_TARGET_RECT: ({ initialRect }, { payload }) => {
			if (payload) {
				return {
					value: 'mooving',
					initialRect,
					targetRect: payload,
					transform: transform(initialRect, payload),
				}
			}

			return {
				value: 'hidden',
				initialRect,
				transform: transform(initialRect, initialRect),
			}
		},
		SYNC: (_, { payload }) => {
			return {
				value: 'syncing',
				initialRect: payload.initialRect,
				targetRect: payload.targetRect,
				transform: transform(
					payload.initialRect,
					payload.targetRect || payload.initialRect,
				),
			}
		},
	},
	syncing: {
		SYNC: (_, { payload }) => {
			return {
				value: 'syncing',
				initialRect: payload.initialRect,
				targetRect: payload.targetRect,
				transform: transform(
					payload.initialRect,
					payload.targetRect || payload.initialRect,
				),
			}
		},
		SET_TARGET_RECT: (state, { payload }) => {
			return {
				...state,
				targetRect: payload,
				transform: payload
					? transform(state.initialRect, payload)
					: state.transform,
			}
		},
		ARRIVED: (state) => {
			return {
				value: 'idle',
				initialRect: state.initialRect,
				transform: state.transform,
			}
		},
	},
	mooving: {
		SYNC: (_, { payload }) => {
			return {
				value: 'syncing',
				initialRect: payload.initialRect,
				targetRect: payload.targetRect,
				transform: transform(
					payload.initialRect,
					payload.targetRect || payload.initialRect,
				),
			}
		},
		SET_TARGET_RECT: (state, { payload }) => {
			return payload
				? {
						value: 'mooving',
						initialRect: state.initialRect,
						targetRect: payload,
						transform: transform(state.initialRect, payload),
				  }
				: {
						value: 'hidden',
						initialRect: state.initialRect,
						transform: transform(
							state.initialRect,
							state.initialRect,
						),
				  }
		},
		ARRIVED: (state) => {
			return {
				value: 'idle',
				initialRect: state.initialRect,
				transform: state.transform,
			}
		},
	},
	hidden: {
		SYNC: (_, { payload }) => {
			return {
				value: 'hidden',
				initialRect: payload.initialRect,
				targetRect: payload.targetRect,
				transform: transform(
					payload.initialRect,
					payload.targetRect || payload.initialRect,
				),
			}
		},
		SET_TARGET_RECT: (state, { payload }) => {
			if (!payload) {
				return state
			}

			return {
				value: 'idle',
				initialRect: state.initialRect,
				targetRect: payload,
				transform: transform(state.initialRect, payload),
			}
		},
	},
}

export const reducer = (state: State, event: Event) => {
	return (
		machine[state.value][event.type]?.(state as never, event as never) ||
		state
	)
}

export const selectCSSTransform = (state: State) => {
	if (state.value === 'initial') {
		return 'translate(0px, 0px) scale(1)'
	}
	return `translate(${state.transform.x}px, ${state.transform.y}px) scale(${state.transform.scale})`
}

export const selectSpringValues = (state: State) => {
	if (state.value === 'initial') {
		return {
			translateX: 0,
			translateY: 0,
			scale: 1,
		}
	}
	return {
		translateX: state.transform.x,
		translateY: state.transform.y,
		scale: state.transform.scale,
	}
}

const initialState: State = {
	value: 'initial',
}

export const usePositionState = ({
	target,
	base,
}: {
	target: Element | null
	base: Element | null
}) => {
	const [prevBase, setPrevBase] = useState(base)
	const [prevTarget, setPrevTarget] = useState(target)
	const [state, send] = useReducer(reducer, initialState)
	let targetRect = null as null | Rect
	if (prevTarget !== target) {
		setPrevTarget(target)
		targetRect = target ? fromElement(target) : null
		send({ type: 'SET_TARGET_RECT', payload: targetRect })
	}
	if (prevBase !== base) {
		setPrevBase(base)
		const initialRect = base
			? fromElement(base)
			: {
					x: 0,
					y: 0,
					width: 0,
					height: 0,
			  }
		// Do not call getBoundingClientRect() too much since it causes repaint
		targetRect = targetRect || (target ? fromElement(target) : null)
		send({
			type: 'SYNC',
			payload: {
				initialRect,
				targetRect,
			},
		})
	}

	return [state, send] as const
}

export const useAnimateTo = (target: Element | null, durationMs: number) => {
	const [base, setBase] = useState<Element | null>(null)

	const [state, send] = usePositionState({
		target,
		base,
	})

	const transform = selectCSSTransform(state)
	useEffect(() => {
		const timeout = setTimeout(() => {
			send({ type: 'ARRIVED' })
		}, durationMs)

		return () => {
			clearTimeout(timeout)
		}
	}, [state, send, durationMs])

	console.log(state.value)
	console.log(transform)

	return [
		state.value === 'hidden'
			? {
					display: 'none',
			  }
			: {
					transform,
					transition:
						state.value === 'mooving'
							? `transform ${durationMs}ms ease-in-out`
							: undefined,
			  },
		setBase,
	] as const
}
