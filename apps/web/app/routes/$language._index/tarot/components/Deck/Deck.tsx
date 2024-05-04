import { forwardRef, memo } from 'react'
import { animated } from '@react-spring/web'

import { type ImgProps } from '~/components'
import { Card } from './Card'

import { useAnimate, getSpringStyles, type ChangeEvent } from './useAnimate'
import type { LoaderData } from './loader'
import type { State } from '../../useStateMachine'

interface Props {
	state: Extract<State, { card: NonNullable<State['card']> }>
	onChange: (animationEvent: ChangeEvent) => void
	cardBackImage: ImgProps['src']
	onClick?: React.MouseEventHandler<HTMLButtonElement>
	form?: string
	deckSSRData: LoaderData
	sizeClassName: string
	submitButtonLabel: React.ReactNode
}

const AnimatedCard = animated(Card<'button'>)
const AnimatedCardBack = animated(Card<'div'>)

export const Deck = memo(
	forwardRef<HTMLDivElement, Props>(
		(
			{
				state,
				onChange,
				deckSSRData,
				onClick,
				form,
				sizeClassName,
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


			return (
				<div
					ref={ref}
					className={
						'relative z-10 flex flex-col items-center justify-center rounded' +
						'' //sizesClassName
					}
				>
					<>
						{springs.map((props, index, array) => {
							const top = index === array.length - 1

							if (top) {
								return (
									<AnimatedCard
										key={index}
										sizeClassName={sizeClassName}
										className=""
										upsideDown={upsideDown}
										as="button"
										type="submit"
										front={card.image}
										back={cardBackImage}
										revealed={
											state.value === 'revealed' ||
											state.value ===
												'initial_revealed' ||
											state.value === 'pre_hide' ||
											state.value === 'revealing'
										}
										form={form}
										onClick={onClick}
										style={
											animate
												? getSpringStyles(props)
												: deckSSRData.style[index]!
										}
									>
										<div className="sr-only">
											{submitButtonLabel}
										</div>
									</AnimatedCard>
								)
							}

							return (
								<div
									key={index}
									className="flex absolute top-0 left-0"
								>
									<AnimatedCardBack
										revealed={false}
										upsideDown={false}
										sizeClassName={sizeClassName}
										style={
											animate
												? getSpringStyles(props)
												: deckSSRData.style[index]!
										}
										back={cardBackImage}
										front={card.image}
									/>
								</div>
							)
						})}
					</>
				</div>
			)
		},
	),
)

Deck.displayName = 'Deck'
