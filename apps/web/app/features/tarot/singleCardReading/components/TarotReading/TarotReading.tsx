import { useState, useEffect } from 'react'
import { useNavigate } from '@remix-run/react'
import { ClientOnly } from 'remix-utils/client-only'

import { Img } from '~/components'

import type { PageData, Card as CardType } from '../../../types'

import { AnimateTo } from './AnimateTo'
import { Layout } from './Layout'
import { Description } from './Description'
import { Form } from './Form'
import { Card } from './Card'
import { PreReveal } from './PreReveal'
import { useRevealState, hiddenState } from './useRevealState'
import { useSingleCardReading } from './useSingleCardReading'
import type { ClientLoaderData } from '../../clientLoader.client'
import { searchParams } from '../../searchParams'

type Props = {
	formContent: PageData['tarotReadingPageContent']
	descriptionPageContent: PageData['tarotOfTheDayPageContent']
	cardsSet: ClientLoaderData['cardsSet']
	currentCard: ClientLoaderData['currentCard']
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
	} as const
}

export const TarotReading = ({
	formContent,
	descriptionPageContent,
	currentCard,
	cardsSet,
}: Props) => {
	const {
		card: pickedCard,
		nextCard,
		pickNextCard,
	} = useSingleCardReading({
		cardsSet,
		currentCard,
	})
	const [{ value: state }, send] = useRevealState(Boolean(currentCard))
	useEffect(() => {
		// We are picking the next card beforehand so it would be preloaded when we reveal it.
		if (state === 'hidden' || state === 'initial_revealed') {
			pickNextCard()
		}
	}, [state, pickNextCard])
	const navigate = useNavigate()
	useEffect(() => {
		if (state === 'revealed' && pickedCard) {
			navigate(
				`/?${searchParams
					.serialize({
						id: pickedCard.card.id,
						upside_down: pickedCard.upsideDown ? '1' : '0',
						scroll_to: 'tarot-reading',
					})
					.toString()}`,
				{
					replace: true,
					preventScrollReset: true,
				},
			)
		}
	}, [state, pickedCard, navigate])

	const [formCardPlaceholder, setFormCardPlaceholder] =
		useState<Element | null>(null)
	const [descriptionCardPlaceholder, setDescriptionCardPlaceholder] =
		useState<Element | null>(null)

	const cardContent = pickedCard ? getCardContent(pickedCard) : null

	const sharedCardState = {
		send,
		face: cardContent?.image || formContent.cardBackImage,
		back: formContent.cardBackImage,
		upsideDown: pickedCard?.upsideDown || false,
	}

	const formPlaceholder = (
		<Card
			{...sharedCardState}
			state="initial_hidden"
			ref={setFormCardPlaceholder}
		/>
	)
	const descriptionPlaceholder = (
		<Card
			{...sharedCardState}
			state="initial_revealed"
			ref={setDescriptionCardPlaceholder}
		/>
	)

	const cardButton = (
		<Card
			{...sharedCardState}
			state={state}
			buttonLabel={formContent.submitButtonLabel}
		/>
	)

	let animateToTarget = formCardPlaceholder
	switch (state) {
		case 'initial_hidden':
		case 'hidden':
		case 'pre_reveal':
		case 'reveal':
		case 'hide':
		case 'pre_hide':
			animateToTarget = formCardPlaceholder
			break
		case 'revealed':
		case 'initial_revealed':
			animateToTarget = descriptionCardPlaceholder
			break
	}

	const card = (
		<ClientOnly fallback={cardButton}>
			{() => (
				<AnimateTo target={animateToTarget} className="inline-flex">
					{cardButton}
				</AnimateTo>
			)}
		</ClientOnly>
	)

	const preloadNextCardImage = nextCard ? (
		<Img src={nextCard.card.image} alt="" aria-hidden="true" />
	) : null

	return (
		<section className="relative flex flex-col items-center">
			<div id="tarot-reading" className="absolute -top-16" />
			<div
				className="sr-only pointer-events-none"
				aria-hidden="true"
				tabIndex={-1}
			>
				<ClientOnly fallback={preloadNextCardImage}>
					{() => {
						return (
							<>
								{preloadNextCardImage}
								{cardsSet.map((card) => (
									<Img
										key={card.id}
										src={card.image}
										alt=""
										aria-hidden="true"
									/>
								))}
							</>
						)
					}}
				</ClientOnly>
			</div>
			<PreReveal
				state={state}
				onFinish={() => send({ type: 'PRE_COMPLETED' })}
			/>
			<Layout
				revealed={!hiddenState[state]}
				form={
					<Form
						onSubmit={() => {
							send({ type: 'REVEAL' })
						}}
						header={formContent.headerTitle}
						description={formContent.formDescription}
						state={state}
						id={pickedCard?.card.id}
						upsideDown={pickedCard?.upsideDown}
						submitButtonLabel={formContent.submitButtonLabel}
					/>
				}
				description={
					cardContent ? (
						<Description
							state={state}
							header={descriptionPageContent.header}
							description={cardContent.description}
							cardTitle={cardContent.title}
						/>
					) : null
				}
				card={card}
				backPlaceholder={formPlaceholder}
				facePlaceholder={descriptionPlaceholder}
			/>
		</section>
	)
}
