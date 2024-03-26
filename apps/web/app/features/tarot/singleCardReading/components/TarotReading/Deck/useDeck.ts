import { useState, useEffect, useCallback, useRef } from 'react'
import { to as interpolate, useSprings } from '@react-spring/web'
import { randInt } from '@repo/utils'

import type { SpringStyles, NonNullableConfig, SpringProps } from './types'

type Props = {
	initialRevealed: boolean
	onRevealed: () => void
	animate: boolean
	initialSprings: ReturnType<typeof getInitialStylesList>
	onHideContent: () => void
	onRevealContent: () => void
	onShuffling: () => void
	onAnimationEnd: () => void
}

const VOID_FUNCTION: VoidFunction = () => void 0

const DECK_SIZE = 18

const getZ = (index: number, multiplyBy: number) => {
	return (index - Math.floor(DECK_SIZE / 2)) * multiplyBy * 10
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
	return `perspective(10000px) translate3d(${getX(x)}, ${getY(
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

const getSpringStyles = (props: SpringProps) => {
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

const getRevealedStyle = (i: number, onRest?: VoidFunction) => {
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
			onRest,
			onStart: VOID_FUNCTION,
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
		onStart: VOID_FUNCTION,
		delay: Math.max(i - 3, 0) * 10,
	}
}

const getShuffleStart = (i: number, onRest?: VoidFunction) => {
	return {
		x: 100,
		scale: 1.05,
		opacity: 1,
		delay: (DECK_SIZE - 1 - i) * 16,
		rotate: 0,
		revealRotate: 0,
		onRest,
		onStart: VOID_FUNCTION,
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
	initialRevealed,
	animate,
}: Pick<Props, 'initialRevealed' | 'animate'>) => {
	return Array(DECK_SIZE)
		.fill('')
		.map((_, i) => {
			let to = from(i)
			if (initialRevealed) {
				to = {
					...getRevealedStyle(i),
					z: to.z,
				}
			}

			return {
				to,
				from: animate ? fromShuffle : to,
			}
		})
}

export const useDeck = ({
	animate,
	initialRevealed,
	onRevealed,
	initialSprings,
	onHideContent,
	onRevealContent,
	onShuffling,
	onAnimationEnd,
}: Props) => {
	const [revealed, setRevealed] = useState(initialRevealed)
	// We don't want to always sync initialRevealed with the state
	// we only need to sync when it's changed
	useEffect(() => {
		setRevealed(initialRevealed)
	}, [initialRevealed])

	const [springs, api] = useSprings(DECK_SIZE, (i) => {
		if (!animate) {
			const to = initialSprings[i]!.to
			return {
				from: to,
				to,
			}
		}
		if (revealed) {
			return {
				from: fromShuffle,
				to: getRevealedStyle(i),
				onStart:
					i === 0
						? () => onHideContent()
						: i === DECK_SIZE - 1
						  ? () => onRevealContent()
						  : undefined,
			}
		}

		return {
			from: fromShuffle,
			to: from(i),
			onStart:
				i === 0
					? () => onHideContent()
					: i === DECK_SIZE - 1
					  ? () => onRevealContent()
					  : undefined,
		}
	})

	const handlersRef = useRef({
		onRevealed,
		onHideContent,
		onRevealContent,
		onShuffling,
		onAnimationEnd,
	})

	handlersRef.current.onRevealed = onRevealed
	handlersRef.current.onHideContent = onHideContent
	handlersRef.current.onRevealContent = onRevealContent
	handlersRef.current.onShuffling = onShuffling
	handlersRef.current.onAnimationEnd = onAnimationEnd

	const onReveal = useCallback(() => {
		const onRevealed = () => handlersRef.current.onRevealed()
		const onHideContent = () => handlersRef.current.onHideContent()
		const onRevealContent = () => handlersRef.current.onRevealContent()
		const onShuffling = () => handlersRef.current.onShuffling()
		const onAnimationEnd = () => handlersRef.current.onAnimationEnd()
		api.start((i) => {
			onHideContent()
			if (revealed) {
				const to = getShuffleStart(i)
				if (i === DECK_SIZE - 1) {
					// Cards left the screen
					to.onRest = () => {
						// At this point we need to get the next card to reveal
						onRevealed()
						onShuffling()

						// Get cards back on screen
						// Teleport cards to the initial position
						api.set(fromShuffle)
						api.start((i) => {
							const to = getShuffleEnd(i)
							if (i === DECK_SIZE - 1) {
								// Cards on the screen, reveal the next one
								to.onRest = () => {
									api.start((i) => {
										const to = getRevealedStyle(i)
										if (i === DECK_SIZE - 1) {
											to.delay = 0
											to.onRest = () => {
												onRevealContent()
												onAnimationEnd()
												// Make sure to set the state for the future updates
												setRevealed(true)
											}
										}

										return to
									})
								}
							}

							return to
						})
					}
				}

				return to
			}

			const to = getRevealedStyle(i)
			if (i === DECK_SIZE - 1) {
				to.onRest = () => {
					onRevealed()
					setRevealed(true)
					onRevealContent()
					api.start((i) => {
						if (i === DECK_SIZE - 1) {
							return {
								y: 0,
								x: 0,
								rotateX: 0,
								rotateY: 0,
								rotateZ: 0,
								rotate: 0,
								delay: 800,
							}
						}
					})
				}
			}

			return to
		})
	}, [api, revealed])

	return {
		springs,
		onReveal,
		getSpringStyles,
	}
}
