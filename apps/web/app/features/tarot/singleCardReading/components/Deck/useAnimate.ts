import { useEffect, useRef } from 'react'
import { to as interpolate, useSprings } from '@react-spring/web'
import { randInt } from '@repo/utils'

import type { SpringStyles, NonNullableConfig, SpringProps } from './types'

import type { State } from '../../useStateMachine'

const VOID_FUNCTION: VoidFunction = () => void 0

const DECK_SIZE = 18

const getZ = (index: number, multiplyBy: number) => {
	return (index - (DECK_SIZE - 1)) * multiplyBy * 10
}

const initialFrom: SpringStyles = {
	x: 0,
	y: 0,
	z: 0,
	rotate: 0,
	rotateY: 0,
	rotateX: 0,
	rotateZ: 0.01,
	scale: 1,
	opacity: 1,
	revealRotate: 0,
}

const initialTo: SpringStyles = { ...initialFrom }

const from = (
	i: number,
): Omit<NonNullableConfig, 'delay' | 'onRest'>['from'] => {
	const rotate = -10 + Math.random() * 20
	const x = Math.random() * 10 * (Math.random() > 0.5 ? -1 : 1) * 0.3
	const y = Math.random() * 10 * (Math.random() > 0.5 ? 2 : 1) * 0.3
	return {
		...initialTo,
		x,
		y,
		z: getZ(i, 1),
		rotate,
		revealRotate: 0,
	}
}

const getX = (percent: number): string => {
	if (!percent) {
		return '0vw'
	}
	return `${percent}vw`
}
const getY = (percent: number): string => {
	if (!percent) {
		return '0vh'
	}

	return `${Math.abs(percent)}vh`
}

const toRevealRotateTransformPositive = (rotate: number) =>
	`rotateY(${rotate}deg)` as const
const toRevealRotateTransformNegative = (rotate: number) =>
	`rotateY(${rotate * -1}deg)` as const

export const interpolateRevealRotate = (
	props: Pick<SpringProps, 'revealRotate'>,
) =>
	[
		{
			transform: interpolate(
				[props.revealRotate],
				toRevealRotateTransformPositive,
			),
		},
		{
			transform: interpolate(
				[props.revealRotate],
				toRevealRotateTransformNegative,
			),
		},
	] as const

const transform = (
	x: number,
	y: number,
	z: number,
	rotateX: number,
	rotateY: number,
	rotateZ: number,
	rotate: number,
	scale: number,
) => {
	return `perspective(1500px) translate3d(${getX(x)}, ${getY(
		y,
	)}, ${z}px)  rotate3d(${rotateX}, ${rotateY}, ${rotateZ}, ${rotate}deg) scale(${scale})` as const
}

export const getSSRStyles = ({
	x,
	y,
	z,
	rotateX,
	rotateY,
	rotateZ,
	rotate,
	revealRotate,
	scale,
	opacity,
}: ReturnType<typeof getInitialStylesList>[number]['to']) => {
	return {
		deck: {
			transform: transform(
				x,
				y,
				z,
				rotateX,
				rotateY,
				rotateZ,
				rotate,
				scale,
			),
			opacity,
			transformStyle: 'preserve-3d',
		},
		revealRotate: {
			transform: `rotateY(${revealRotate}deg)`,
		},
	} as const
}

export const getSpringStyles = (props: SpringProps) => {
	return {
		transform: interpolate(
			[
				props.x,
				props.y,
				props.z,
				props.rotateX,
				props.rotateY,
				props.rotateZ,
				props.rotate,
				props.scale,
			],
			transform,
		),
		opacity: props.opacity,
		transformStyle: 'preserve-3d',
	} as const
}

const getRevealedStyle = (
	i: number,
	{ onRest, onStart }: { onRest?: VoidFunction; onStart?: VoidFunction },
) => {
	if (i !== DECK_SIZE - 1) {
		return {
			x: Math.random() * (Math.random() > 0.5 ? 1 : -1) * 0.1,
			y: Math.random() * 4,
			rotate: Math.random() * (Math.random() > 0.5 ? 1 : -1) * 2,
			rotateY: 0,
			rotateX: 0,
			rotateZ: 0.1,
			revealRotate: 0,
			scale: 1,
			delay: i * 10,
			opacity: 1,
		}
	}
	const inBrowser = typeof window !== 'undefined'
	return {
		x: Math.random() * (Math.random() > 0.5 ? 1 : -1),
		y: Math.random(),
		rotateY: 0,
		rotateX: 0,
		rotateZ: 1,
		rotate: inBrowser
			? Math.random() * (Math.random() > 0.5 ? 1 : -1) * 6
			: 0,
		revealRotate: -180,
		scale: 1,
		opacity: 1,
		onRest,
		onStart: i === 0 ? onStart : undefined,
		delay: Math.max(i - 3, 0) * 10,
	}
}

const getShuffleStart = (
	i: number,
	{ onRest, onStart }: { onRest?: VoidFunction; onStart?: VoidFunction },
) => {
	return {
		x: 100,
		scale: 1.05,
		opacity: 1,
		delay: (DECK_SIZE - 1 - i) * 16,
		rotate: 0,
		revealRotate: 0,
		onRest: i === DECK_SIZE - 1 ? onRest : undefined,
		onStart: i === 0 ? onStart : undefined,
	}
}

const getShuffleEnd = (i: number, onRest?: VoidFunction) => {
	return {
		...from(i),
		delay:
			DECK_SIZE - 1 === i
				? i * 20
				: randInt(0, DECK_SIZE - 1) * (20 + randInt(0, 5)),
		onRest,
		onStart: VOID_FUNCTION,
	}
}

const fromShuffle = {
	x: -105,
	y: 0,
	rotate: 0,
	rotateY: 0,
	rotateX: 0,
	rotateZ: 0.01,
	scale: 1,
	opacity: 1,
}

export const getInitialStylesList = ({
	revealed,
	animate,
}: {
	revealed: boolean
	animate: boolean
}) => {
	return Array(DECK_SIZE)
		.fill('')
		.map((_, i) => {
			let to = from(i)
			if (revealed) {
				to = {
					...getRevealedStyle(i, {}),
					z: to.z,
				}
			}

			return {
				to,
				from: animate
					? {
							...fromShuffle,
							z: getZ(i, 1),
					  }
					: to,
			}
		})
}

export type ChangeEvent =
	| {
			type: 'HIDING_START'
	  }
	| {
			type: 'HIDING_END'
	  }
	| {
			type: 'REVEALING_START'
	  }
	| {
			type: 'REVEALING_END'
	  }

type Props = {
	state: State['value']
	initialStyles: ReturnType<typeof getInitialStylesList>
	onChange: (event: ChangeEvent) => void
}

export const useAnimate = ({ state, onChange, initialStyles }: Props) => {
	const [springs, api] = useSprings(DECK_SIZE, (i) => initialStyles[i]!)
	const onChangeRef = useRef(onChange)
	onChangeRef.current = onChange
	useEffect(() => {
		switch (state) {
			case 'error':
			case 'initial_hidden':
			case 'initial_revealed':
			case 'pre_reveal':
			case 'revealed':
			case 'hidden':
				return
			case 'revealing':
				api.start((i) => {
					const config = getRevealedStyle(i, {})
					if (i === 0) {
						config.onStart = () => {
							onChangeRef.current({ type: 'REVEALING_START' })
						}
					}
					if (i === DECK_SIZE - 1) {
						config.onRest = () => {
							onChangeRef.current({ type: 'REVEALING_END' })
						}
					}

					return config
				})
				return
			case 'pre_hide':
				api.start((i) => {
					const config = getShuffleStart(i, {})
					if (i === 0) {
						config.onStart = () => {
							onChangeRef.current({ type: 'HIDING_START' })
						}
					}
					if (i === DECK_SIZE - 1) {
						config.onRest = () => {
							api.set(fromShuffle)
						}
					}

					return config
				})
				return
			case 'hiding':
				api.set(fromShuffle)
				api.start((i) => {
					const config = getShuffleEnd(i)
					if (i === DECK_SIZE - 1) {
						config.onRest = () => {
							onChangeRef.current({ type: 'HIDING_END' })
						}
					}

					return config
				})
				return
			default:
				return
		}
	}, [api, state])

	return springs
}
