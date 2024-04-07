import { forwardRef, memo } from 'react'
import { animated } from '@react-spring/web'

import { type ImgProps, Img } from '~/components'

import {
	useAnimate,
	interpolateRevealRotate,
	getSpringStyles,
	type ChangeEvent,
} from './useAnimate'
import { CardBack } from './CardBack'
import type { LoaderData } from './loader'
import type { State } from '../../useStateMachine'

interface Props {
	state: Extract<State, { card: NonNullable<State['card']> }>
	onChange: (animationEvent: ChangeEvent) => void
	cardBackImage: ImgProps['src']
	onClick?: React.MouseEventHandler<HTMLButtonElement>
	form?: string
	deckSSRData: LoaderData
	className: string
	submitButtonLabel: React.ReactNode
}

export const Deck = memo(
	forwardRef<HTMLDivElement, Props>(
		(
			{
				state,
				onChange,
				deckSSRData,
				onClick,
				form,
				className,
				submitButtonLabel,
				cardBackImage,
			},
			ref,
		) => {
			const springs = useAnimate({
				state: state.value,
				onChange,
				initialStyles: deckSSRData.springs,
			})

			const animate =
				state.value !== 'initial_revealed' &&
				state.value !== 'initial_hidden'

			const { card, upsideDown } = state.card

			const cardContainerClassName =
				'absolute top-0 left-0 rounded w-full h-full '
			const imgClassName =
				'rounded border-4 border-slate-50 bg-slate-50 shadow-lg w-full h-full '
			const cardImageContainerClassName =
				'rounded w-full h-full flex flex-col items-center justify-center flex-shrink-0 '

			const face = (
				<Img
					src={card.image}
					alt=""
					aria-hidden="true"
					style={
						upsideDown
							? {
									transform: 'rotate(180deg)',
							  }
							: undefined
					}
					className={
						imgClassName +
						' ' +
						(upsideDown ? 'border-t-8' : 'border-b-8')
					}
				/>
			)
			const placeholder = (
				<div
					style={{
						height: 'h-full w-full',
					}}
					className="relative max-w-full overflow-hidden -z-50 shadow-none pointer-events-none opacity-0 flex flex-row flex-nowrap"
				>
					{face}
				</div>
			)

			return (
				<div
					ref={ref}
					className={
						'w-full h-full relative z-10 flex flex-col items-center justify-center rounded ' +
						className
					}
					style={{
						height: 'auto',
						aspectRatio: `${card.image.placeholder.originalDimentions[0]}/${card.image.placeholder.originalDimentions[1]}`,
					}}
				>
					<>
						<div className="sr-only">{submitButtonLabel}</div>
						{springs.map((props, index, array) => {
							const top = index === array.length - 1

							if (top) {
								const [, revealRotate] =
									interpolateRevealRotate(props)
								const shared = {
									WebkitBackfaceVisibility: 'hidden',
									backfaceVisibility: 'hidden',
								} as const

								return (
									<animated.button
										key={index}
										type="submit"
										form={form}
										onClick={onClick}
										className="absolute w-full h-full top-0 left-0"
										style={
											animate
												? getSpringStyles(props)
												: deckSSRData.style[index]!.deck
										}
									>
										<div className="relative w-full h-full rounded">
											<div
												style={{
													perspective: '1000px',
													transform: `translateZ(10px)`,
												}}
												className="relative"
											>
												{placeholder}
												<animated.div
													style={{
														...(animate
															? revealRotate
															: deckSSRData.style[
																	index
															  ]!.revealRotate),
														transformStyle:
															'preserve-3d',
													}}
													className={
														'absolute w-full h-full top-0 left-0 rounded '
													}
												>
													<div
														style={shared}
														className={
															cardImageContainerClassName
														}
													>
														<CardBack
															face={face}
															back={cardBackImage}
															style={{
																...shared,
															}}
															className={
																imgClassName +
																' border-b-8'
															}
														/>
													</div>
													<div
														style={{
															...shared,
															transform: `rotateY(180deg)`,
														}}
														className={
															cardImageContainerClassName +
															' absolute top-0 left-0'
														}
													>
														{face}
													</div>
												</animated.div>
											</div>
										</div>
									</animated.button>
								)
							}

							return (
								<animated.div
									key={index}
									className={cardContainerClassName}
									style={
										animate
											? getSpringStyles(props)
											: deckSSRData.style[index]!.deck
									}
								>
									<div
										className={cardImageContainerClassName}
									>
										<CardBack
											face={face}
											back={cardBackImage}
											className={
												imgClassName + ' border-b-8'
											}
										/>
									</div>
								</animated.div>
							)
						})}
					</>
				</div>
			)
		},
	),
)

Deck.displayName = 'Deck'
