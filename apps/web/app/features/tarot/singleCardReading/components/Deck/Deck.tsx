import { forwardRef } from 'react'
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
			'absolute top-0 left-0 rounded bg-tranparent'
		const imgClassName =
			'rounded border-4 border-slate-50 shadow-lg '
		const cardImageContainerClassName =
			'rounded flex flex-col items-center justify-center flex-shrink-0 bg-tranparent '

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
					height: 'min-content',
				}}
				className="relative max-w-full overflow-hidden -z-50 shadow-none pointer-events-none opacity-0 flex flex-row flex-nowrap"
			>
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
									className="absolute top-0 left-0"
									style={
										animate
											? getSpringStyles(props)
											: deckSSRData.style[index]!.deck
									}
								>
									<div className="relative w-full h-full rounded">
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
													style={shared}
													className={
														cardImageContainerClassName
													}
												>
													<CardBack
														face={face}
														url={
															cardBackImage.sm.src
														}
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
								<div className={cardImageContainerClassName}>
									<CardBack
										face={face}
										url={cardBackImage.sm.src}
										className={imgClassName + ' border-b-8'}
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
