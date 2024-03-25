import { useState } from 'react'
import { animated } from '@react-spring/web'
import { ClientOnly } from 'remix-utils/client-only'

import { type ImgProps, Img, BodyBottomPortal } from '~/components'

import { AnimateTo } from '../AnimateTo'
import { useHoldScroll } from '../useHoldScroll'
import { useDeck, interpolateRevealRotate } from './useDeck'
import type { LoaderData } from './loader'
import type { ReadyToRenderCard } from '../../../../types'

interface Props {
	initialRevealed: boolean
	cardBackImage: ImgProps['src']
	pickedCard: Pick<ReadyToRenderCard, 'image' | 'upsideDown'> | null
	onRevealed: () => void
	onClick?: React.MouseEventHandler<HTMLButtonElement>
	children: React.ReactNode
	type: 'button' | 'submit'
	form?: string
	animate: boolean
	deckSSRData: LoaderData
	className: string
	onHideContent: () => void
	onRevealContent: () => void
}

export const Deck = ({
	initialRevealed,
	pickedCard,
	cardBackImage,
	deckSSRData,
	onRevealed,
	onClick,
	type,
	form,
	children,
	animate: initialAnimate,
	className,
	onHideContent,
	onRevealContent,
}: Props) => {
	const [animate, setAnimate] = useState(Boolean(initialAnimate))
	const [middleOfTheScreen, setMiddleOfTheScreen] = useState<Element | null>(
		null,
	)
	const [nonAnimatingTarget, setNonAnimatingTarget] =
		useState<Element | null>(null)
	const [animating, setAnimating] = useState(false)
	const [positionTarget, setPositionTarget] = useState(nonAnimatingTarget)
	if (!positionTarget && nonAnimatingTarget) {
		setPositionTarget(nonAnimatingTarget)
	}

	useHoldScroll(animating)

	const { onReveal, springs, getSpringStyles } = useDeck({
		onRevealed,
		initialRevealed,
		animate,
		initialSprings: deckSSRData.springs,
		onShuffling: () => {
			setPositionTarget(middleOfTheScreen)
		},
		onHideContent,
		onRevealContent: () => {
			setPositionTarget(nonAnimatingTarget)
			onRevealContent()
			setAnimating(false)
		},
	})

	const cardContainerClassName = 'absolute top-0 left-0 bg-stone-50 rounded'
	const imgClassName = 'rounded bg-stone-50'
	const cardImageContainerClassName =
		'shadow-lg rounded p-1 pb-2 bg-stone-50 flex flex-col items-center justify-center flex-shrink-0'

	const deck = (
		<button
			className={
				'relative flex flex-col items-center justify-center rounded ' +
				className
			}
			type={type}
			form={form}
			onClick={(event) => {
				onClick?.(event)
				setAnimating(true)
				setAnimate(true)
				onReveal()
			}}
		>
			{springs.map((props, index, array) => {
				const asButton = index === array.length - 1

				if (asButton) {
					const [revealRotate] = interpolateRevealRotate(props)
					const shared = {
						WebkitBackfaceVisibility: 'hidden',
						backfaceVisibility: 'hidden',
					} as const

					const placeholder = (
						<div className="flex flex-row flex-nowrap">
							<Img
								src={cardBackImage}
								alt=""
								aria-hidden="true"
								className="relative -z-50 opacity-0 bg-transparent shadow-none pointer-events-none"
							/>
							{pickedCard ? (
								<Img
									src={pickedCard.image}
									alt=""
									aria-hidden="true"
									className="relative -z-50 opacity-0 bg-transparent shadow-none pointer-events-none"
								/>
							) : null}
						</div>
					)
					return (
						<animated.div
							key={index}
							className="absolute top-0 left-0"
							style={getSpringStyles(props)}
						>
							<div className="sr-only">{children}</div>
							<div className="relative w-full h-full bg-transparent rounded">
								<animated.div
									style={{
										perspective: '10000px',
										background: 'transparent',
									}}
									className="relative"
								>
									{placeholder}
									<animated.div
										style={{
											...revealRotate,
											transformStyle: 'preserve-3d',
										}}
										className={
											'absolute top-0 left-0 rounded '
										}
									>
										{placeholder}
										<animated.div
											style={shared}
											className={
												cardContainerClassName +
												' ' +
												cardImageContainerClassName
											}
										>
											<Img
												src={cardBackImage}
												alt=""
												aria-hidden="true"
												className={imgClassName}
											/>
										</animated.div>
										<animated.div
											style={{
												...shared,
												transform: `rotateY(180deg)`,
											}}
											className={
												cardContainerClassName +
												' ' +
												cardImageContainerClassName
											}
										>
											{pickedCard ? (
												<Img
													src={pickedCard?.image}
													alt=""
													aria-hidden="true"
													style={
														pickedCard.upsideDown
															? {
																	transform:
																		'rotateX(180deg)',
															  }
															: undefined
													}
													className={imgClassName}
												/>
											) : null}
										</animated.div>
									</animated.div>
								</animated.div>
							</div>
						</animated.div>
					)
				}

				return (
					<animated.div
						key={index}
						className={cardContainerClassName}
						style={getSpringStyles(props)}
					>
						<div
							className={
								'w-full h-full bg-inherit relative overflow-hidden rounded ' +
								cardImageContainerClassName
							}
						>
							<Img
								src={cardBackImage}
								alt=""
								aria-hidden="true"
								className={imgClassName}
							/>
						</div>
					</animated.div>
				)
			})}
		</button>
	)

	return (
		<ClientOnly fallback={deck}>
			{() => (
				<div className="flex flex-col items-center justify-center">
					<BodyBottomPortal>
						<div className="absolute top-0 left-0">
							<div
								className={
									'fixed inset-0 flex flex-col items-center justify-center pointer-events-none'
								}
							>
								<div
									className={
										'relative flex flex-col items-center justify-center ' +
										className
									}
								>
									<Img
										className="relative -z-50 opacity-0 bg-transparent shadow-none pointer-events-none"
										ref={setMiddleOfTheScreen}
										src={cardBackImage}
										alt=""
										aria-hidden="true"
									/>
								</div>
							</div>
						</div>
					</BodyBottomPortal>

					<Img
						className="relative -z-50 opacity-0 bg-transparent shadow-none pointer-events-none"
						ref={setNonAnimatingTarget}
						src={cardBackImage}
						alt=""
						aria-hidden="true"
					/>
					<AnimateTo
						key={
							String(initialRevealed) + String(pickedCard?.image)
						}
						target={positionTarget}
						trackForMs={5000}
					>
						{deck}
					</AnimateTo>
				</div>
			)}
		</ClientOnly>
	)
}
