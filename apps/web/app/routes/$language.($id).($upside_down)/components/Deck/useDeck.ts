import { useCallback, useMemo } from 'react'
import { matches, useAnimationState } from '../../AnimationState'
import { useRouteLoadersData } from '../../RouteLoadersDataProvider'

import { useAnimate } from './useAnimate'

const isRevealed = matches([
	'idle_revealed',
	'idle_ssr_revealed',
	'revealing_flipping_card',
	'revealing_replacing_deck',
	'revealing_revealing_content',
	'hiding_pre_animate_scroll',
	'hiding_pre_animate_hide_content',
])

export const useDeck = () => {
	const {
		deckSSRData,
		content: {
			tarotReadingPageContent: { cardBackImage, submitButtonLabel },
		},
	} = useRouteLoadersData()
	const [state, send, card, upsideDown] = useAnimationState()

	const pickedCard = useMemo(
		() => ({
			img: card.image,
			upsideDown,
		}),
		[card, upsideDown],
	)
	const revealed = isRevealed(state)
	const onFlipped = useCallback(() => {
		send({ type: 'CARD_FLIPPED' })
	}, [send])
	const springs = useAnimate(deckSSRData.springs)

	return {
		springs,
		onFlipped,
		revealed,
		pickedCard,
		cardBackImage,
		submitButtonLabel,
		deckSSRData,
	}
}
