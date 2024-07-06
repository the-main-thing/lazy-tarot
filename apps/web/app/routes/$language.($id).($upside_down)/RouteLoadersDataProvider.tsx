import { useParams } from '@remix-run/react'
import { createContext, useContext, useMemo, useEffect, useState } from 'react'
import { pickRandomCard } from '@repo/core'

import { useGetCardsSet } from '~/routes/api.$language.get-full-tarot-set.$build-timestamp/useGetCardsSet'
import { revealed } from './revealed'
import { getPrevPickedCards, setPrevPickedCards } from './localStorage'
import type { LoaderData } from './loader.server'

export type RouteLoadersData = ReturnType<typeof useLoadersData>

const useLoadersData = (loaderData: LoaderData) => {
	const params = useParams()
	const { language } = params
	const isRevealed = revealed(params)
	if (!language) {
		throw new Error('No language provided')
	}

	const { data: cardsSet } = useGetCardsSet(language)
	const [pickedInitialCard, setPickedInitialCard] = useState<null | {
		card: LoaderData['card']
		upsideDown: boolean
	}>(null)
	useEffect(() => {
		if (pickedInitialCard || !cardsSet || isRevealed) {
			return
		}
		const prevPickedCards = getPrevPickedCards()
		const [error, result] = pickRandomCard({
			prevPickedCards,
			cardsSet,
			getIdFromSetItem: (card) => card.id,
		})
		if (error || !result) {
			return
		}
		const card = cardsSet.find((card) => card.id === result.id)
		if (!card) {
			return
		}
		setPrevPickedCards(result.prevPickedCards)
		setPickedInitialCard({
			card,
			upsideDown: result.upsideDown,
		})
	}, [cardsSet, pickedInitialCard, isRevealed])

	const { content, deckSSRData } = loaderData
	const card = pickedInitialCard?.card || loaderData.card
	let upsideDown = pickedInitialCard
		? pickedInitialCard.upsideDown
		: loaderData.upsideDown
	if ('upside_down' in params) {
		upsideDown = params.upside_down === '1'
	}

	return useMemo(() => {
		return {
			content,
			deckSSRData,
			language,
			revealed: isRevealed,
			upsideDown,
			card,
		} as const
	}, [content, deckSSRData, language, isRevealed, upsideDown, card])
}

const Context = createContext<RouteLoadersData | null>(null)

export const useRouteLoadersData = () => {
	const context = useContext(Context)
	if (!context) {
		throw new Error(
			'useRouteLoadersData must be used within an RouteLoadersDataProvider',
		)
	}

	return context
}

export const RouteLoadersDataProvider = ({
	children,
	loaderData,
}: {
	children: React.ReactNode
	loaderData: LoaderData
}) => {
	return (
		<Context.Provider value={useLoadersData(loaderData)}>
			{children}
		</Context.Provider>
	)
}
