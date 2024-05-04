import { useState, useEffect, useMemo, memo } from 'react'
import { useSearchParams, useLocation } from '@remix-run/react'
import { ClientOnly } from 'remix-utils/client-only'
import { useReducedMotion } from '@react-spring/web'

import { Img, type ImgProps } from '~/components'
import { LocalStorage, KEYS } from '~/utils/localStorage'
import { useQueryCardsSet } from './query'

import type { PageData, Card as CardType } from './types'

import { useStateMachine, type State } from './useStateMachine'
import { useHoldScroll } from './useHoldScroll'
import { Deck } from './components/Deck/Deck'
import { Card } from './components/Deck/Card'

import { HideContent } from './components/HideContent'
import { ResetButton } from './components/ResetButton'
import { AnimateTo } from './components/AnimateTo'
import { Description } from './components/Description'
import { Form } from './components/Form'
import { FORM_ID } from './components/constants'
import type { LoaderData } from './loader.server'
import { searchParams } from './searchParams'

type Props = LoaderData & {
	pageContent: PageData['tarotReadingPageContent']
}

type ContentfullProps = Pick<Props, 'deckSSRData' | 'pageContent'> & {
	state: Extract<State, { card: NonNullable<State['card']> }>
} & ReturnType<typeof useStateMachine>[1]

const CARD_SIZE_CLASS_NAME =
	'landscape:w-screen-h-50 landscape:max-w-screen-22 portrait:w-screen-50 portrait:max-w-screen-h-60'

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
		shortDescription: card[variantKey].shortDescription,
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

const useScrollIntoView = (state: State['value'], element: Element | null) => {
	useEffect(() => {
		if (!element) {
			return
		}
		if (state !== 'hiding' && state !== 'pre_hide') {
			return
		}

		element.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'center',
		})
	}, [state, element])
}

const TarotReadingContentfull = ({
	pageContent,
	state,
	deckSSRData,
	onHidden,
	onHide,
	onReveal,
	onRevealed,
	onPreRevealEnd,
	onPreHideEnd,
	onReset,
}: ContentfullProps) => {
	useReducedMotion()
	const [formCardPlaceholder, setFormCardPlaceholder] =
		useState<Element | null>(null)
	const [descriptionCardPlaceholder, setDescriptionCardPlaceholder] =
		useState<Element | null>(null)

	useScrollIntoView(state.value, formCardPlaceholder)

	const animateTo = useMemo(() => {
		switch (state.value) {
			case 'revealed':
			case 'initial_revealed':
			case 'pre_hide':
				return descriptionCardPlaceholder
			default:
				return formCardPlaceholder
		}
	}, [state.value, formCardPlaceholder, descriptionCardPlaceholder])

	useHoldScroll(
		state.value !== 'initial_hidden' &&
			state.value !== 'hidden' &&
			state.value !== 'revealed' &&
			state.value !== 'initial_revealed',
	)

	const { nextCard, card } = state
	const preloadNextCardImage = nextCard ? (
		<div className="sr-only absolute opacity-0" aria-hidden="true">
			<Img
				className="sr-only"
				src={nextCard.card.image}
				alt=""
				aria-hidden="true"
			/>
		</div>
	) : null

	const [urlSearchParams, setURLSearchParams] = useSearchParams()
	const reset = urlSearchParams.get('reset') === '1'
	const [deckElement, setDeckElement] = useState<HTMLDivElement | null>(null)
	const [placeholderElelement, setPlaceholderElement] =
		useState<HTMLElement | null>(null)
	const deck = (
		<Deck
			ref={setDeckElement}
			key={String(reset)}
			state={state}
			submitButtonLabel={pageContent.submitButtonLabel}
			sizeClassName={CARD_SIZE_CLASS_NAME}
			cardBackImage={pageContent.cardBackImage}
			deckSSRData={deckSSRData}
			form={FORM_ID}
			onChange={({ type }) => {
				switch (type) {
					case 'REVEALING_END':
						return onRevealed()
					case 'HIDING_END':
						return onHidden()
				}
			}}
		/>
	)

	const placeholderClassName =
		CARD_SIZE_CLASS_NAME + ' opacity-0 pointer-events-none z-50 relative'
	const placeholderChild = (
		<Img src={pageContent.cardBackImage} alt="" aria-hidden="true" />
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

	const formIsHidden =
		state.value === 'initial_revealed' ||
		state.value === 'revealed' ||
		state.value === 'pre_hide'
	const { pathname } = useLocation()

	useEffect(() => {
		if (reset) {
			onReset()
			return
		}
	}, [reset, onReset])

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (state.value === 'hidden') {
				const params = new URLSearchParams()
				setURLSearchParams(params, {
					preventScrollReset: true,
				})
				return
			}
			if (state.value === 'revealed') {
				const nextParams = searchParams.serialize({
					id: card.card.id,
					upside_down: card.upsideDown ? '1' : '0',
					scroll_to: 'tarot-reading',
				})
				setURLSearchParams(nextParams, {
					preventScrollReset: true,
				})
			}
		}, 500)

		return () => {
			clearTimeout(timeout)
		}
	}, [
		card.card.id,
		card.upsideDown,
		pathname,
		state.value,
		setURLSearchParams,
	])

	const pickedCard = getCardContent(card)

	return (
		<section>
			<div id="tarot-reading" className="relative -top-16" />
			{preloadNextCardImage}

			<div className="relative flex flex-col w-full">
				<div
					className={
						'flex flex-col items-center w-full gap-12' +
						(formIsHidden
							? ' absolute -translate-x-screen opacity-0 top-0 left-0 -z-50 pointer-events-none'
							: '')
					}
				>
					<Form
						id={FORM_ID}
						cardId={card.card.id}
						upsideDown={card.upsideDown}
						onSubmit={(event) => {
							event.preventDefault()
							switch (state.value) {
								case 'revealed':
								case 'initial_revealed':
									return onHide()
								case 'hidden':
								case 'initial_hidden':
									return onReveal()
								default:
									return
							}
						}}
						hidden={formIsHidden}
						header={pageContent.headerTitle}
						description={pageContent.formDescription}
					/>
					{/* <DeckPlaceholderContainer deck={deck} state={state.value}>
						{formPlaceholder}
					</DeckPlaceholderContainer> */}
					<RenderDeck
						state={state.value}
						setPlaceholderElement={setPlaceholderElement}
						deckElement={deckElement}
						back={pageContent.cardBackImage}
						front={pickedCard.image || pageContent.cardBackImage}
						placement="form"
						placeholderElement={placeholderElelement}
					>
						{deck}
					</RenderDeck>
				</div>
				<div
					className={
						!formIsHidden
							? 'absolute -z-50 opacity-0 pointer-events-none'
							: ''
					}
				>
					<Description
						hidden={!formIsHidden}
						header={pageContent.pickedCardTitle}
						descriptionTitleText={
							pageContent.cardDescriptionHeaderText
						}
						shortDescription={pickedCard.shortDescription}
						description={pickedCard.description}
						cardTitle={pickedCard.title}
					>
						<RenderDeck
							state={state.value}
							setPlaceholderElement={setPlaceholderElement}
							deckElement={deckElement}
							back={pageContent.cardBackImage}
							front={
								pickedCard.image || pageContent.cardBackImage
							}
							placement="description"
							placeholderElement={placeholderElelement}
						>
							{deck}
						</RenderDeck>
						{/* <DeckPlaceholderContainer
							deck={deck}
							state={state.value}
						>
							{descriptionPlaceholder}
						</DeckPlaceholderContainer>
						<ResetButton
							className="mt-16 flex rounded border-2 border-slate-200 w-full justify-center items-center p-4 uppercase hover:bg-stone-600 hover:text-stone-100 transition-all focus:bg-slate-600 focus:text-slate-100"
							state={state.value}
							type="submit"
							form={FORM_ID}
						>
							{pageContent.pickNextCardButtonLabel}
						</ResetButton> */}
					</Description>
				</div>
				<ClientOnly fallback={null}>
					{() => (
						<>
							<HideContent
								state={state.value}
								onRest={() => {
									if (state.value === 'pre_reveal') {
										onPreRevealEnd()
									}
									if (state.value === 'pre_hide') {
										onPreHideEnd()
									}
								}}
							/>
							{/* <DeckAnimateToContainer state={state.value}>
								<AnimateTo trackForMs={500} target={animateTo}>
									<div className="flex relative z-10">
										{deck}
									</div>
								</AnimateTo>
							</DeckAnimateToContainer> */}
						</>
					)}
				</ClientOnly>
			</div>
		</section>
	)
}

export const TarotReading = memo(
	({ revealed, card, deckSSRData, pageContent, language }: Props) => {
		const { data: cardsSet } = useQueryCardsSet(language)
		const [state, handlers] = useStateMachine({
			revealed,
			card,
			cardsSet,
			getHistory,
			setHistory,
		})

		if (state.value === 'error') {
			return null
		}

		return (
			<TarotReadingContentfull
				state={state}
				{...handlers}
				deckSSRData={deckSSRData}
				pageContent={pageContent}
			/>
		)
	},
)

TarotReading.displayName = 'TarotReading'

function RenderDeck({
	state,
	placement,
	setPlaceholderElement,
	front,
	deckElement,
	placeholderElement,
	back,
	children,
}: {
	state: State['value']
	back: ImgProps['src']
	front: ImgProps['src']
	placement: 'form' | 'description'
	deckElement: HTMLElement | null
	placeholderElement: HTMLElement | null
	setPlaceholderElement: React.Dispatch<
		React.SetStateAction<HTMLElement | null>
	>
	children: React.ReactNode
}) {
	const [animateFrom] = useState(() => {
		if (state === 'initial_revealed') {
			return 'description'
		}
		return 'form'
	})

	if (state === 'error') {
		return null
	}

	if (animateFrom === placement) {
		const revealed = state === 'revealed' || state === 'initial_revealed'

		let target = deckElement
		switch (placement) {
			case 'form':
				target = revealed ? placeholderElement : deckElement
				break
			case 'description':
				target = revealed ? deckElement : placeholderElement
				break
			default:
				console.error('unknown placement', placement)
				target = deckElement
				break
		}

		return (
			<AnimateTo target={target}>
				{children}
			</AnimateTo>
		)
	}

	return (
		<Card
			ref={setPlaceholderElement}
			front={front}
			back={back}
			upsideDown={false}
			revealed={false}
			aria-disabled="true"
			className="pointer-events-none opacity-0"
			sizeClassName={CARD_SIZE_CLASS_NAME}
		/>
	)
}

function DeckPlaceholderContainer({
	children,
	deck,
	state,
}: {
	state: State['value']
	deck: React.ReactNode
	children: React.ReactNode
}) {
	switch (state) {
		case 'error':
			return null
		case 'initial_hidden':
		case 'initial_revealed':
			return <div className="">{deck}</div>
		default:
			return (
				<div className="relative pointer-events-none -z-50">
					{children}
					<div className="absolute top-0 left-0" />
				</div>
			)
	}
}

function DeckAnimateToContainer({
	children,
	state,
}: {
	children: React.ReactNode
	state: State['value']
}) {
	switch (state) {
		case 'error':
		case 'initial_hidden':
		case 'initial_revealed':
			return null
		default:
			return children
	}
}
