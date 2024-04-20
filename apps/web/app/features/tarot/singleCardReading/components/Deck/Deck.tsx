import { forwardRef, memo } from 'react'
import { animated } from '@react-spring/web'

import { type ImgProps, Img } from '~/components'

import { useAnimate, getSpringStyles, type ChangeEvent } from './useAnimate'
import type { LoaderData } from './loader'
import type { State } from '../../useStateMachine'

import { Flip } from '~/components/Card/Flip'

interface Props {
	state: Extract<State, { card: NonNullable<State['card']> }>
	onChange: (animationEvent: ChangeEvent) => void
	cardBackImage: ImgProps['src']
	onClick?: React.MouseEventHandler<HTMLButtonElement>
	form?: string
	deckSSRData: LoaderData
	sizesClassName: string
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
				sizesClassName,
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

			const imgClassName =
				'rounded border-4 border-slate-50 bg-slate-50 shadow-lg ' +
				sizesClassName

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

			return (
				<div
					ref={ref}
					className={
						'relative z-10 flex flex-col items-center justify-center rounded ' +
						sizesClassName
					}
				>
					<>
						<div className="sr-only">{submitButtonLabel}</div>
						{springs.map((props, index, array) => {
							const top = index === array.length - 1

							if (top) {
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
												: deckSSRData.style[index]!
										}
									>
										<Flip
											face={face}
											back={
												<Img
													src={cardBackImage}
													className={imgClassName}
												/>
											}
											revealed={
												state.value === 'revealed' ||
												state.value ===
													'initial_revealed' ||
												state.value === 'pre_hide' ||
												state.value === 'revealing'
											}
										/>
									</animated.button>
								)
							}

							return (
								<animated.div
									key={index}
									style={
										animate
											? getSpringStyles(props)
											: deckSSRData.style[index]!
									}
									className={
										'absolute top-0 left-0 ' +
										sizesClassName
									}
								>
									<Img
										src={cardBackImage}
										className={imgClassName}
									/>
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
