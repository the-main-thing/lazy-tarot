import { useEffect, forwardRef, useMemo } from 'react'
import { useSprings, animated } from '@react-spring/web'
import classNames from 'classnames'

import { PortableText } from '~/components/PortableText'
import { Typography } from '~/components'
import { capitalize } from '@repo/utils'
import { useRouteLoadersData } from '../RouteLoadersDataProvider'
import type { useAnimationState } from '../AnimationState'
type Card = ReturnType<typeof useAnimationState>[2]

interface Props {
	children: React.ReactNode
	card: Card
	upsideDown: boolean
	isVisible: boolean
	prepareAnimation: boolean
	className?: string
	onAnimationComplete?: () => void
	onAnimationStart?: () => void
}

const hidden = {
	opacity: 0,
	scale: 0.8,
}
const visible = {
	opacity: 1,
	scale: 1,
}

export const TarotReadingRevealedCard = forwardRef<HTMLDivElement, Props>(
	(
		{
			children,
			isVisible,
			className,
			onAnimationComplete,
			onAnimationStart,
			card: currentCardContent,
			upsideDown,
			prepareAnimation,
		},
		ref,
	) => {
		const [springs, api] = useSprings(3, () => {
			const to = isVisible ? visible : hidden
			return {
				from: to,
				to,
			}
		})

		useEffect(() => {
			const to = isVisible ? visible : hidden
			api.start((i) => {
				return {
					...to,
					delay: i * 100,
					onStart: i === 0 ? onAnimationStart : undefined,
					onRest: i === 2 ? onAnimationComplete : undefined,
				}
			})
		}, [isVisible, api, onAnimationStart, onAnimationComplete])

		const {
			content: { tarotReadingPageContent },
		} = useRouteLoadersData()

		const content = useMemo(() => {
			const key = upsideDown ? 'upsideDown' : 'regular'
			const card = {
				title: currentCardContent[key].title,
				description: currentCardContent[key],
			}
			return (
				<div className="flex flex-col gap-8">
					<animated.div
						style={springs[1]!}
						className={classNames(
							'text-pretty hyphens-auto flex flex-col gap-2',
							prepareAnimation ? 'will-change-transform' : '',
						)}
					>
						<Typography variant="h5" className="italic">
							{card.title}
						</Typography>
						{card.description.shortDescription ? (
							<Typography variant="default" className="italic">
								{capitalize(card.description.shortDescription)}
							</Typography>
						) : null}
					</animated.div>
					{card.description.fullDescription ? (
						<animated.div
							style={springs[2]!}
							className={classNames(
								'text-pretty hyphens-auto text-justify flex flex-col gap-8',
								prepareAnimation ? 'will-change-transform' : '',
							)}
						>
							<PortableText
								value={card.description.fullDescription}
							/>
						</animated.div>
					) : null}
				</div>
			)
		}, [currentCardContent, prepareAnimation, springs, upsideDown])

		return (
			<article
				ref={ref}
				aria-hidden={isVisible ? 'false' : 'true'}
				className={
					'flex flex-col gap-16 md:gap-16 portrait:items-center ' +
					(className || '')
				}
			>
				<animated.div
					style={springs[0]!}
					className={prepareAnimation ? 'will-change-transform' : ''}
				>
					<PortableText
						value={tarotReadingPageContent.pickedCardTitle}
					/>
				</animated.div>
				<div className="flex landscape:flex-row portrait:flex-col-reverse gap-16 md:gap-16">
					{content}
					{children}
				</div>
			</article>
		)
	},
)

TarotReadingRevealedCard.displayName = 'TarotReadingRevealedCard'
