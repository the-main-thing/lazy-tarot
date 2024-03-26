import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from '@remix-run/react'
import { ClientOnly } from 'remix-utils/client-only'
import { useSpring, animated } from '@react-spring/web'
import { pickRandomCard } from '@repo/utils'

import { Img, BodyBottomPortal } from '~/components'
import { LocalStorage, KEYS } from '~/utils/localStorage'
import { useQueryCardsSet } from '../../../query'

import type { PageData, Card as CardType } from '../../../types'

import { Deck } from './Deck/Deck'

import { AnimateTo } from './AnimateTo'
import { Description } from './Description'
import { Form } from './Form'
import { FORM_ID } from './constants'
import type { ClientLoaderData } from '../../clientLoader.client'
import type { LoaderData } from '../../loader.server'
import { searchParams } from '../../searchParams'

type Props = {
	formContent: PageData['tarotReadingPageContent']
	descriptionPageContent: PageData['tarotOfTheDayPageContent']
	cardsSet: NonEmptyArray<
		(LoaderData['cardsSet'] | ClientLoaderData['cardsSet'])[number]
	>
	currentCard: LoaderData['currentCard'] | ClientLoaderData['currentCard']
	deckSSRData: LoaderData['deckSSRData']
	nextCard: LoaderData['nextCard']
}

const getCardContent = ({
	card,
	upsideDown,
}: {
	card: CardType
	upsideDown: boolean
}) => {
	const variantKey = upsideDown
		? ('upsideDown' as const)
		: ('regular' as const)

	return {
		id: card.id,
		title: card[variantKey].title,
		description: card[variantKey].fullDescription,
		image: card.image,
		upsideDown,
	} as const
}

const getHistory = (): Array<{ id: string; upsideDown: boolean }> => {
	try {
		const localStorage = new LocalStorage()
		const value = localStorage.getItem(KEYS.singleCardReading)
		if (!value) {
			return []
		}
		const parsedHistory = JSON.parse(value)
		return parsedHistory.map(
			({ id, upsideDown }: any) =>
				({ id, upsideDown }) as { id: string; upsideDown: boolean },
		)
	} catch (error) {
		console.error('getHistory error', error)
		return []
	}
}

const setHistory = (history: Array<{ id: string; upsideDown: boolean }>) => {
	try {
		const localStorage = new LocalStorage()
		localStorage.setItem(KEYS.singleCardReading, JSON.stringify(history))
	} catch (error) {
		console.error('setHistory error', error)
	}
}

const isContentfulCard = (card: unknown): card is CardType => {
	return Boolean(
		card &&
			typeof card === 'object' &&
			'id' in card &&
			'upsideDown' in card &&
			card.upsideDown &&
			typeof card.upsideDown === 'object' &&
			'regular' in card &&
			card.regular &&
			typeof card.regular === 'object' &&
			'image' in card &&
			card.image &&
			typeof card.image === 'object',
	)
}

export const TarotReading = ({
	formContent,
	descriptionPageContent,
	currentCard,
	nextCard: initialNextCard,
	deckSSRData,
}: Props) => {
	const navigate = useNavigate()
	const inBrowser = typeof window !== 'undefined'
	const { data: cardsSet } = useQueryCardsSet()
	const nextCard = useMemo(() => {
		if (!inBrowser || !cardsSet?.length) {
			return initialNextCard
		}

		return pickRandomCard({
			prev: getHistory().concat(
				currentCard
					? [
							{
								id: currentCard.card.id,
								upsideDown: currentCard.upsideDown,
							},
					  ]
					: [],
			),
			source: cardsSet as NonEmptyArray<(typeof cardsSet)[number]>,
		})
	}, [inBrowser, cardsSet, currentCard, initialNextCard])

	const nextPickedCard = useMemo(() => {
		if (nextCard) {
			const id =
				'id' in nextCard
					? nextCard.id
					: 'card' in nextCard
					  ? nextCard.card.id
					  : null
			const card =
				id && cardsSet?.length
					? cardsSet.find((card) => card.id === id)
					: undefined
			if (isContentfulCard(card)) {
				return getCardContent({
					card,
					upsideDown: nextCard?.upsideDown,
				})
			}
		}

		return null
	}, [nextCard, cardsSet])

	const [pickedCard, setPickedCard] = useState(() => {
		if (currentCard) {
			return getCardContent(currentCard)
		}

		return null
	})
	useEffect(() => {
		if (currentCard) {
			setPickedCard(getCardContent(currentCard))
			return
		}

		if (nextPickedCard) {
			setPickedCard(nextPickedCard)
			return
		}
	}, [currentCard, nextCard, cardsSet, nextPickedCard])

	const revealed = Boolean(currentCard)

	useEffect(() => {
		if (currentCard && cardsSet?.length) {
			setHistory(
				getHistory()
					.slice(-cardsSet.length)
					.concat([
						{
							id: currentCard.card.id,
							upsideDown: currentCard.upsideDown,
						},
					]),
			)
		}
	}, [currentCard, cardsSet])

	const [formCardPlaceholder, setFormCardPlaceholder] =
		useState<Element | null>(null)
	const [descriptionCardPlaceholder, setDescriptionCardPlaceholder] =
		useState<Element | null>(null)

	const preloadNextCardImage = nextPickedCard ? (
		<Img
			className="sr-only"
			src={nextPickedCard.image}
			alt=""
			aria-hidden="true"
		/>
	) : null

	const { state } = useLocation()
	const animate: boolean = Boolean(
		typeof state === 'object' &&
			state &&
			'animate' in state &&
			state.animate,
	)

	const nextCardId = nextCard
		? 'id' in nextCard
			? nextCard.id
			: 'card' in nextCard
			  ? nextCard.card.id
			  : undefined
		: undefined
	const nextCardUpsideDown = Boolean(nextCard?.upsideDown)

	const deckClassName =
		'landscape:w-screen-h-60 landscape:max-w-screen-15 portrait:w-screen-50 portrait:max-w-screen-h-60'
	const [animatingNewCard, setAnimatingNewCard] = useState(false)
	const [hideContentSpring, hideContentApi] = useSpring(() => ({
		from:
			animatingNewCard && revealed
				? { opacity: 1, translateX: '0vw' }
				: { opacity: 0, translateX: '-1000vw' },
		to:
			animatingNewCard && revealed
				? { opacity: 0, translateX: '0vw' }
				: { opacity: 0, translateX: '-1000vw' },
	}))

	useEffect(() => {
		if (animatingNewCard) {
			hideContentApi.set({ translateX: '0vw' })
			hideContentApi.start({ opacity: 1 })
			return
		}
		if (!animatingNewCard) {
			hideContentApi.set({ translateX: '0vw' })
			hideContentApi.start({
				opacity: 0,
				onRest: () => {
					hideContentApi.set({ translateX: '-1000vw' })
				},
			})
			return
		}
	}, [hideContentApi, animatingNewCard])

	const deck = (
		<Deck
			className={deckClassName}
			pickedCard={pickedCard}
			cardBackImage={formContent.cardBackImage}
			initialRevealed={revealed}
			deckSSRData={deckSSRData}
			onHideContent={() => {
				setAnimatingNewCard(true)
			}}
			onRevealContent={() => {
				setAnimatingNewCard(false)
			}}
			onRevealed={() => {
				if (!nextCard) {
					return
				}
				const nextId = 'id' in nextCard ? nextCard.id : nextCard.card.id
				const nextUpsideDown = nextCard.upsideDown
				navigate(
					`/?${searchParams
						.serialize({
							id: nextId,
							upside_down: nextUpsideDown ? '1' : '0',
							scroll_to: 'tarot-reading',
						})
						.toString()}`,
					{
						replace: true,
						preventScrollReset: true,
						state: {
							animate: true,
						},
					},
				)
			}}
			type={animate ? 'button' : 'submit'}
			form={FORM_ID}
			animate={animate}
		>
			{formContent.submitButtonLabel}
		</Deck>
	)

	const placeholderClassName =
		deckClassName + ' opacity-0 pointer-events-none z-50 relative'
	const placeholderChild = (
		<Img src={formContent.cardBackImage} alt="" aria-hidden="true" />
	)

	const formPlaceholder = (
		<div ref={setFormCardPlaceholder} className={placeholderClassName}>
			{placeholderChild}
		</div>
	)
	const descriptionPlaceholder = (
		<div
			ref={setDescriptionCardPlaceholder}
			className={placeholderClassName}
		>
			{placeholderChild}
		</div>
	)

	return (
		<section>
			<div id="tarot-reading" className="relative -top-16" />
			{preloadNextCardImage}

			<div className="relative flex flex-col items-center">
				<div
					className={
						'flex flex-col items-center gap-12' +
						(revealed
							? ' absolute -translate-x-screen opacity-0 top-0 left-0'
							: '')
					}
				>
					<Form
						id={FORM_ID}
						cardId={nextCardId}
						upsideDown={nextCardUpsideDown}
						onSubmit={(event) => {
							event.preventDefault()
						}}
						hidden={revealed}
						animate={animate}
						header={formContent.headerTitle}
						description={formContent.formDescription}
					/>
					<div className="relative">
						<ClientOnly
							fallback={
								<>
									{formPlaceholder}
									<div className="absolute top-0 left-0">
										{deck}
									</div>
								</>
							}
						>
							{() => (
								<>
									{formPlaceholder}
									<div className="absolute top-0 left-0" />
								</>
							)}
						</ClientOnly>
					</div>
				</div>
				<div
					className={
						!revealed
							? 'absolute -z-50 opacity-0 pointer-events-none'
							: ''
					}
				>
					{revealed ? (
						<Description
							hidden={!revealed}
							header={descriptionPageContent.header}
							description={pickedCard?.description}
							cardTitle={pickedCard?.title}
							animate={animate}
							animatingNewCard={animatingNewCard}
						>
							<div className="relative">
								<ClientOnly
									fallback={
										<>
											{descriptionPlaceholder}
											<div className="absolute top-0 left-0">
												{deck}
											</div>
										</>
									}
								>
									{() => (
										<>
											{descriptionPlaceholder}
											<div className="absolute top-0 left-0" />
										</>
									)}
								</ClientOnly>
							</div>
						</Description>
					) : null}
				</div>
				<ClientOnly fallback={null}>
					{() => (
						<>
							<BodyBottomPortal>
								<div className="absolute top-0 left-0">
									<animated.div
										style={hideContentSpring}
										className="fixed bg-white w-screen h-screen top-0 left-0 pointer-events-none overflow-hidden"
									/>
								</div>
							</BodyBottomPortal>
							<AnimateTo
								trackForMs={10000}
								target={
									(revealed && pickedCard)
										? descriptionCardPlaceholder
										: formCardPlaceholder
								}
							>
								{deck}
							</AnimateTo>
						</>
					)}
				</ClientOnly>
			</div>
		</section>
	)
}
