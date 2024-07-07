/* eslint-disable no-extra-semi */
import { forwardRef, memo, useCallback, useRef } from 'react'
import { animated } from '@react-spring/web'
import classNames from 'classnames'

import { isElementMostlyVisible } from '../../isElementMostlyVisible'
import { Card } from './Card'

import type { useDeck } from './useDeck'

import { getSpringStyles } from './useAnimate'

interface Props extends ReturnType<typeof useDeck> {
	asPlaceholder: boolean
	form: string
	sizeClassName: string
	isAnimateable: boolean
	className?: string
	style?: React.ComponentProps<'div'>['style']
}

const AnimatedCard = animated(Card<'button'>)
const AnimatedCardBack = animated(Card<'div'>)

const DeckLayoutContainer = forwardRef<
	HTMLDivElement,
	{
		children: React.ReactNode
		className?: string
		asPlaceholder: boolean
		style?: React.ComponentProps<'div'>['style']
	}
>(({ children, className, asPlaceholder, style }, ref) => {
	return (
		<div
			ref={ref}
			style={style}
			className={classNames(
				'relative z-10 flex flex-col rounded',
				asPlaceholder ? 'opacity-0' : '',
				className ? className : '',
			)}
		>
			{children}
		</div>
	)
})

DeckLayoutContainer.displayName = 'DeckLayoutContainer'

const DeckButton = memo(
	forwardRef<HTMLDivElement, Omit<Props, 'asPlaceholder'>>(
		(
			{
				form,
				sizeClassName,
				isAnimateable,
				springs,
				pickedCard,
				cardBackImage,
				deckSSRData,
				revealed,
				onFlipped,
				submitButtonLabel,
			},
			ref,
		) => {
			const containerRef = useRef<HTMLDivElement | null>(null)
			const mergeRefs = useCallback(
				(node: HTMLDivElement | null) => {
					if (typeof ref === 'function') {
						ref(node)
					} else if (ref) {
						ref.current = node
					}
					containerRef.current = node
				},
				[ref],
			)
			const onClick = useCallback(() => {
				if (revealed && isElementMostlyVisible(containerRef.current)) {
					return
				}
				containerRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'center',
				})
			}, [revealed])
			return (
				<div
					ref={mergeRefs}
					className={
						'relative z-10 flex flex-col items-center justify-center rounded'
					}
				>
					{springs.map((props, index, array) => {
						const top = index === array.length - 1

						if (top) {
							return (
								<AnimatedCard
									key={index}
									revealed={revealed}
									upsideDown={pickedCard.upsideDown}
									onChange={onFlipped}
									sizeClassName={classNames(
										'will-change-transform',
										sizeClassName,
									)}
									onClick={onClick}
									className=""
									as="button"
									type="submit"
									front={pickedCard.img}
									back={cardBackImage}
									form={form}
									style={
										isAnimateable
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
									sizeClassName={classNames(
										'will-change-transform',
										sizeClassName,
									)}
									revealed={false}
									upsideDown={false}
									onChange={() => void 0}
									style={
										isAnimateable
											? getSpringStyles(props)
											: deckSSRData.style[index]!
									}
									back={cardBackImage}
									front={pickedCard.img}
								/>
							</div>
						)
					})}
				</div>
			)
		},
	),
)

DeckButton.displayName = 'DeckButton'

export const Deck = forwardRef<HTMLDivElement, Props>(
	({ style, ...props }, ref) => {
		const {
			pickedCard,
			deckSSRData,
			cardBackImage,
			sizeClassName,
			asPlaceholder,
			className,
		} = props
		return (
			<DeckLayoutContainer
				ref={ref}
				className={className}
				asPlaceholder={asPlaceholder}
				style={style}
			>
				{asPlaceholder ? (
					<Card
						as="div"
						sizeClassName={
							sizeClassName + ' opacity-0 pointer-events-none'
						}
						revealed={false}
						upsideDown={false}
						style={deckSSRData.style.at(-1)}
						back={cardBackImage}
						front={pickedCard.img}
					/>
				) : (
					<DeckButton {...props} />
				)}
			</DeckLayoutContainer>
		)
	},
)

Deck.displayName = 'Deck'
