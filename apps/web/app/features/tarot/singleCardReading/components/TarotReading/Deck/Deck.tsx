import { useState } from 'react'
import { animated } from '@react-spring/web'
import { ClientOnly } from 'remix-utils/client-only'

import { type ImgProps, Img, BodyBottomPortal } from '~/components'

import { AnimateTo } from '../AnimateTo'
import { useHoldScroll } from '../useHoldScroll'
import { useDeck } from './useDeck'
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

	const deck = (
		<div
			className={
				'relative flex flex-col items-center justify-center ' +
				className
			}
		>
			{springs.map((props, index, array) => {
				const asButton = index === array.length - 1
				const Component = asButton ? animated.button : animated.div

				return (
					<Component
						key={index}
						type={asButton ? type : undefined}
						form={asButton ? form : undefined}
						className={
							'top-0 p-1 pb-2 bg-white rounded drop-shadow-md md:drop-shadow-lg overflow-hidden' +
							(asButton ? '' : ' absolute')
						}
						style={getSpringStyles(props)}
						onClick={
							asButton
								? (event) => {
										setAnimating(true)
										onClick?.(
											event as React.MouseEvent<HTMLButtonElement>,
										)
										setAnimate(true)
										onReveal()
								  }
								: undefined
						}
					>
						{asButton ? (
							<div className="sr-only">{children}</div>
						) : null}
						<div className="w-full h-full bg-inherit relative overflow-hidden rounded">
							{asButton && pickedCard ? (
								<Img
									src={pickedCard.image}
									className="absolute top-0 left-0"
									style={{
										transform: `rotateY(180deg)${
											pickedCard.upsideDown
												? ' rotateX(180deg)'
												: ''
										}`,
									}}
								/>
							) : null}
							<Img
								src={cardBackImage}
								className="w-full h-full"
								style={{
									transform: `rotate3d(0, 1, 0, 0deg)`,
									backfaceVisibility: 'hidden',
								}}
							/>
						</div>
					</Component>
				)
			})}
		</div>
	)

	return (
		<ClientOnly fallback={deck}>
			{() => (
				<div className="flex flex-col items-center justify-center">
					<BodyBottomPortal>
						<div className="absolute top-0 left-0">
							<div
								className={
									'fixed inset-0 flex flex-col items-center justify-center'
								}
							>
								<div
									className={
										'relative flex flex-col items-center justify-center ' +
										className
									}
								>
									<Img
										className="opacity-0 relative -z-50"
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
						className="opacity-0 relative -z-50"
						ref={setNonAnimatingTarget}
						src={cardBackImage}
						alt=""
						aria-hidden="true"
					/>
					<AnimateTo
						key={String(initialRevealed)}
						target={positionTarget}
					>
						{deck}
					</AnimateTo>
				</div>
			)}
		</ClientOnly>
	)
}
