import { useRef, useState, useEffect } from 'react'
import { Form } from '@remix-run/react'
import { useSpring, animated } from '@react-spring/web'
import classNames from 'classnames'

import { TarotReadingHiddenCard } from './TarotReadingHiddenCard'
import { TarotReadingRevealedCard } from './TarotReadingRevealedCard'
import {
	useAnimationState,
	matches,
	type AnimationState,
} from '../AnimationState'
import { useRouteLoadersData } from '../RouteLoadersDataProvider'
import { Deck, useDeck } from './Deck'
import {
	CARD_SIZE_CLASS_NAME,
	FORM_ID,
	TAROT_READING_SECTION_ID,
} from '../constants'
import { useBlockScroll, useLayoutContext } from './Layout'

const AnimatedDeck = animated(Deck)

const hiddenReadingIsVisibleState = matches([
	'idle_hidden',
	'idle_ssr_hidden',
	'hiding_revealing_content',
])
const hiddenReadingIsInDomFlow = matches([
	'idle_hidden',
	'idle_ssr_hidden',
	'revealing_pre_animate_scroll',
	'revealing_pre_animate_hide_content',
	'revealing_flipping_card',
	'revealing_replacing_deck',
	'hiding_replacing_deck',
	'hiding_revealing_content',
])
const hiddenReadingIsAbsolutePosition = matches([
	'revealing_replacing_deck',
	'revealing_flipping_card',
])

const hiddenReadingClassName = (state: AnimationState) => {
	if (!hiddenReadingIsInDomFlow(state)) {
		return 'absolute top-0 left-0 w-full opacity-0 pointer-events-none -translate-x-screen'
	}
	if (hiddenReadingIsAbsolutePosition(state)) {
		return 'absolute top-0 left-0 w-full'
	}

	return ''
}

const revealedReadingIsVisibleState = matches([
	'idle_revealed',
	'idle_ssr_revealed',
	'revealing_revealing_content',
])

const revealedReadingIsInDomFlow = matches([
	'idle_revealed',
	'idle_ssr_revealed',
	'revealing_flipping_card',
	'revealing_replacing_deck',
	'revealing_revealing_content',
	'hiding_pre_animate_scroll',
	'hiding_pre_animate_hide_content',
	'hiding_wiping_deck_off',
])
const revealedReadingClassName = (state: AnimationState) => {
	if (!revealedReadingIsInDomFlow(state)) {
		return 'hidden'
	}
	return ''
}

const matchIsNotAnimateable = matches(['idle_ssr_hidden', 'idle_ssr_revealed'])
const matchIsAnimateable = (state: AnimationState) =>
	!matchIsNotAnimateable(state)

const hiddenDeckAsPlaceholder = matches([
	'hiding_pre_animate_scroll',
	'hiding_pre_animate_hide_content',
	'hiding_wiping_deck_off',
	'revealing_replacing_deck',
	'revealing_revealing_content',
	'idle_revealed',
	'idle_ssr_revealed',
])

const revealedDeckAsPlaceholder = matches([
	'hiding_replacing_deck',
	'hiding_revealing_content',
	'idle_hidden',
	'idle_ssr_hidden',
	'revealing_pre_animate_scroll',
	'revealing_pre_animate_hide_content',
])

const preventRevealedDeckAnimation = matches(['revealing_flipping_card'])

const matchScrollable = matches([
	'idle_hidden',
	'idle_revealed',
	'idle_ssr_hidden',
	'idle_ssr_revealed',
	'revealing_pre_animate_scroll',
	'hiding_pre_animate_scroll',
])

const blockScroll = (state: AnimationState) => !matchScrollable(state)

const matchIdleState = matches([
	'idle_hidden',
	'idle_revealed',
	'idle_ssr_hidden',
	'idle_ssr_revealed',
])

export const TarotReading = () => {
	const [state, send, card, upsideDown] = useAnimationState()
	const formRef = useRef<HTMLFormElement | null>(null)
	const isAnimateable = matchIsAnimateable(state)
	const [hiddenDeckElement, setHiddenDeckElement] =
		useState<HTMLDivElement | null>(null)
	const [revealedDeckElement, setRevealedDeckElement] =
		useState<HTMLDivElement | null>(null)
	const [revealedDeckSpring, revealedDeckSpringApi] = useSpring(() => {
		return {
			to: {
				x: 0,
				y: 0,
			},
		}
	})

	useBlockScroll(blockScroll(state))
	const { scrollElement } = useLayoutContext()

	useEffect(() => {
		if (
			state === 'hiding_pre_animate_scroll' ||
			state === 'revealing_pre_animate_scroll'
		) {
			const element =
				state === 'hiding_pre_animate_scroll'
					? revealedDeckElement?.children.item(0)
					: hiddenDeckElement?.children.item(0)
			if (
				state === 'hiding_pre_animate_scroll' &&
				element &&
				isElementPartiallyVisible(element)
			) {
				return send({ type: 'PREANIMATE_END_SCROLL' })
			}
			element?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			})
			let timeout = setTimeout(() => {
				send({ type: 'PREANIMATE_END_SCROLL' })
			}, 80)
			const onScroll = () => {
				clearTimeout(timeout)
				timeout = setTimeout(() => {
					send({ type: 'PREANIMATE_END_SCROLL' })
				}, 40)
			}
			scrollElement?.addEventListener('scroll', onScroll)
			return () => {
				scrollElement?.removeEventListener('scroll', onScroll)
			}
		}
		if (state === 'revealing_revealing_content') {
			revealedDeckSpringApi.start({
				x: 0,
				y: 0,
			})
			return
		}
		const prepareTransition = () => {
			const hiddenDeckRect = hiddenDeckElement?.getBoundingClientRect()
			if (!hiddenDeckRect) {
				return
			}
			if (!revealedDeckElement) {
				return
			}
			const frames = [
				window.requestAnimationFrame(() => {
					const revealedRect =
						revealedDeckElement.getBoundingClientRect()
					revealedDeckSpringApi.set({
						x: hiddenDeckRect.left - revealedRect.left,
						y: hiddenDeckRect.top - revealedRect.top,
					})
				}),
			]

			return () => {
				frames.forEach((frame) => window.cancelAnimationFrame(frame))
			}
		}
		if (state === 'revealing_flipping_card') {
			return prepareTransition()
		}
		if (state === 'revealing_replacing_deck') {
			return send({ type: 'DECK_REPLACED' })
		}
	}, [
		state,
		send,
		hiddenDeckElement,
		revealedDeckElement,
		revealedDeckSpringApi,
		scrollElement,
	])

	const { language, revealed, content } = useRouteLoadersData()
	const deckState = useDeck()
	const pickNextCardButtonLabel =
		content.tarotReadingPageContent.pickNextCardButtonLabel

	return (
		<section className="relative" id={TAROT_READING_SECTION_ID}>
			<Form
				ref={formRef}
				action={`/${language}`}
				id={FORM_ID}
				method="POST"
				preventScrollReset
			>
				<input type="hidden" name="id" value={card.id} />
				<input
					type="hidden"
					name="upside_down"
					value={upsideDown ? '1' : '0'}
				/>
				<input
					type="hidden"
					name="revealed"
					value={revealed ? '1' : '0'}
				/>
			</Form>
			<TarotReadingHiddenCard
				isVisible={hiddenReadingIsVisibleState(state)}
				className={hiddenReadingClassName(state)}
				onAnimationComplete={() => {
					send({ type: 'HIDDEN_CONTENT_REVEALED' })
				}}
			>
				<Deck
					{...deckState}
					ref={setHiddenDeckElement}
					form={FORM_ID}
					sizeClassName={CARD_SIZE_CLASS_NAME}
					asPlaceholder={hiddenDeckAsPlaceholder(state)}
					isAnimateable={isAnimateable}
				/>
			</TarotReadingHiddenCard>
			<TarotReadingRevealedCard
				isVisible={revealedReadingIsVisibleState(state)}
				className={revealedReadingClassName(state)}
				prepareAnimation={matchIdleState(state)}
				onAnimationComplete={() => {
					send({ type: 'REVEALED_CONTENT_REVEALED' })
				}}
				card={card}
				upsideDown={upsideDown}
			>
				<div className="flex flex-col gap-24">
					<AnimatedDeck
						ref={setRevealedDeckElement}
						{...deckState}
						style={revealedDeckSpring}
						revealed
						form={FORM_ID}
						sizeClassName={CARD_SIZE_CLASS_NAME}
						asPlaceholder={revealedDeckAsPlaceholder(state)}
						isAnimateable={
							isAnimateable &&
							!preventRevealedDeckAnimation(state)
						}
						className={
							preventRevealedDeckAnimation(state)
								? 'opacity-0 pointer-events-none'
								: ''
						}
					/>
					{revealedReadingIsInDomFlow(state) ? (
						<button
							form={FORM_ID}
							type="submit"
							className={classNames(
								'rounded border flex py-4 px-8 items-center justify-center transition-all duration-200',
								revealedReadingIsVisibleState(state)
									? ''
									: 'opacity-0',
							)}
						>
							{pickNextCardButtonLabel}
						</button>
					) : null}
				</div>
			</TarotReadingRevealedCard>
		</section>
	)
}

function isElementPartiallyVisible(el: Element) {
	const rect = el.getBoundingClientRect()

	const windowHeight =
		window.innerHeight || document.documentElement.clientHeight
	const windowWidth =
		window.innerWidth || document.documentElement.clientWidth

	const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0
	const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0

	return vertInView && horInView
}
