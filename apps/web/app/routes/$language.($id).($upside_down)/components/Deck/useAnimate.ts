import { useEffect } from 'react'
import { to as interpolate, useSprings } from '@react-spring/web'
import { randInt } from '@repo/utils'
import { rand } from './random'

import { useAnimationState } from '../../AnimationState'
import type { SpringStyles, NonNullableConfig, SpringProps } from './types'

const VOID_FUNCTION: VoidFunction = () => void 0

const DECK_SIZE = 18

const getZ = (index: number, multiplyBy: number) => {
	return (index - (DECK_SIZE - 1)) * multiplyBy * 10
}

const randBool = () => rand() > 0.5
const randDir = () => (randBool() ? 1 : -1)

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
}

const initialTo: SpringStyles = { ...initialFrom }

const from = (
	i: number,
): Omit<NonNullableConfig, 'delay' | 'onRest'>['from'] => {
	const rotate = -10 + rand() * 20
	const x = rand() * 10 * randDir() * 0.3
	const y = rand() * 10 * (randBool() ? 2 : 1) * 0.3
	return {
		...initialTo,
		x,
		y,
		z: getZ(i, 1),
		rotate,
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
	scale,
	opacity,
}: ReturnType<typeof getInitialStylesList>[number]['to']) => {
	return {
		transform: transform(x, y, z, rotateX, rotateY, rotateZ, rotate, scale),
		opacity,
		transformStyle: 'preserve-3d',
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
			x: rand() * randDir() * 0.1,
			y: rand() * 4,
			rotate: rand() * randDir() * 2,
			rotateY: 0,
			rotateX: 0,
			rotateZ: 0.1,
			scale: 1,
			delay: i * 10,
			opacity: 1,
		}
	}
	return {
		x: rand() * randDir(),
		y: rand(),
		rotateY: 0,
		rotateX: 0,
		rotateZ: 1,
		rotate: rand() * randDir() * 6,
		scale: 1,
		opacity: 1,
		onRest,
		onStart: i === 0 ? onStart : undefined,
		delay: Math.max(i - 3, 0) * 10,
	}
}

const getShuffleStart = (i: number) => {
	return {
		x: 50,
		delay: (DECK_SIZE - 1 - i) * 16,
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

export const useAnimate = (
	initialStyles: ReturnType<typeof getInitialStylesList>,
) => {
	const [springs, api] = useSprings(DECK_SIZE, (i) => initialStyles[i]!)
	const [state, send] = useAnimationState()
	useEffect(() => {
		if (state === 'hiding_wiping_deck_off') {
			api.start((i) => {
				const config = getShuffleStart(i)
				if (i === DECK_SIZE - 1) {
					return {
						...config,
						onRest: () => {
							api.set(fromShuffle)
							send({ type: 'DECK_WIPED_OFF' })
						},
					}
				}

				return config
			})

			return
		}
		if (state === 'hiding_replacing_deck') {
			api.set(fromShuffle)
			api.start((i) => {
				const config = getShuffleEnd(i)
				if (i === 0) {
					config.onStart = () => send({ type: 'DECK_REPLACED' })
				}
				return config
			})
			return
		}

		if (state === 'revealing_flipping_card') {
			api.start((i) => {
				const config = getRevealedStyle(i, {})

				return config
			})
			return
		}
	}, [api, state, send])

	return springs
}
