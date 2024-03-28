import { forwardRef } from 'react'
import { animated } from '@react-spring/web'

import { type ImgProps, Img } from '~/components'

import {
	useAnimate,
	interpolateRevealRotate,
	getSpringStyles,
	type ChangeEvent,
} from './useAnimate'
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

export const Deck = forwardRef<HTMLDivElement, Props>(
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
			state.value !== 'ininital_hidden'

		const { card, upsideDown } = state.card

		const cardContainerClassName =
			'absolute top-0 left-0 bg-stone-50 rounded'
		const imgClassName = 'rounded bg-stone-50'
		const cardImageContainerClassName =
			'shadow-lg rounded bg-stone-50 flex flex-col items-center justify-center flex-shrink-0 border border-4 border-b-8 border-slate-100 overflow-hidden'

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
				className={imgClassName + ' opacity-0'}
			/>
		)

		const placeholder = (
			<div className="relative max-w-full overflow-hidden -z-50 bg-transparent shadow-none pointer-events-none opacity-0 flex flex-row flex-nowrap">
				{face}
			</div>
		)

		const deck = (
			<div
				className={
					'relative flex flex-col items-center justify-center rounded ' +
					className
				}
			>
				{placeholder}
				<>
					<div className="sr-only">{submitButtonLabel}</div>
					{springs.map((props, index, array) => {
						const top = index === array.length - 1

						if (top) {
							const [revealRotate] =
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
									className="absolute top-0 left-0 bg-transparent"
									style={
										animate
											? getSpringStyles(props)
											: deckSSRData.style[index]!.deck
									}
								>
									<div className="relative w-full h-full bg-transparent rounded">
										<div
											style={{
												perspective: '10000px',
												background: 'transparent',
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
													'absolute top-0 left-0 rounded '
												}
											>
												<div
													style={{
														...shared,
														width: '100%',
														height: '100%',
														backgroundImage: `url(${cardBackImage.sm.src})`,
														backgroundSize: 'cover',
														backgroundPosition:
															'center',
														backgroundRepeat:
															'no-repeat',
													}}
													className={
														cardImageContainerClassName
													}
												>
													<Img
														src={card.image}
														alt=""
														aria-hidden="true"
														style={
															upsideDown
																? {
																		transform:
																			'rotate(180deg)',
																  }
																: undefined
														}
														className={
															imgClassName +
															' opacity-0'
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
													{card ? (
														<Img
															src={card.image}
															alt=""
															aria-hidden="true"
															style={
																upsideDown
																	? {
																			transform:
																				'rotate(180deg)',
																	  }
																	: undefined
															}
															className={
																imgClassName
															}
														/>
													) : null}
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
									style={{
										width: '100%',
										height: '100%',
										backgroundImage: `url(${cardBackImage.sm.src})`,
										backgroundSize: 'cover',
										backgroundPosition: 'center',
										backgroundRepeat: 'no-repeat',
									}}
									className={cardImageContainerClassName}
								>
									<Img
										src={card.image}
										alt=""
										aria-hidden="true"
										style={
											upsideDown
												? {
														transform:
															'rotate(180deg)',
												  }
												: undefined
										}
										className={imgClassName + ' opacity-0'}
									/>
								</div>
							</animated.div>
						)
					})}
				</>
			</div>
		)

		return (
			<div
				ref={ref}
				className="flex flex-col items-center justify-center w-full"
			>
				{deck}
			</div>
		)
	},
)

Deck.displayName = 'Deck'
