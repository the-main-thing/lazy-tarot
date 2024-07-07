import { redirect, json, redirectDocument } from '@remix-run/react'
import type { ClientActionFunctionArgs } from '@remix-run/react'
import type { SerializeFrom } from '@remix-run/node'

import { pickRandomCard } from '@repo/core'

import { queryClient } from '~/QueryProvider'
import {
	getKey,
	queryCardsSet,
	type CardsSet,
} from '../api.$language.get-full-tarot-set.$build-timestamp/useGetCardsSet'
import { getPrevPickedCards, setPrevPickedCards } from './localStorage'

export type ActionData = SerializeFrom<typeof clientAction>

export const clientAction = async ({
	request,
	params,
}: ClientActionFunctionArgs) => {
	const { language } = params
	if (!language) {
		throw redirectDocument(`/?ts=${Date.now()}`)
	}
	const formData = await request.formData()
	const cardId = formData.get('id')
	const upsideDown = formData.get('upside_down')
	const revealed = formData.get('revealed')
	if (!cardId || !upsideDown || !revealed) {
		throw redirectDocument(`/?ts=${Date.now()}`)
	}

	if (revealed === '0') {
		throw redirect(
			`/${language}/${cardId}/${upsideDown === '1' ? '1' : '0'}`,
		)
	}

	const prevPickedCards = getPrevPickedCards()

	const cardsSet = await queryClient.fetchQuery<CardsSet>({
		queryKey: getKey(language),
		queryFn: () => queryCardsSet(language),
		staleTime: Infinity,
		gcTime: Infinity,
	})

	const [errorPickingRandomCard, result] = pickRandomCard({
		prevPickedCards,
		cardsSet,
		getIdFromSetItem: ({ id }) => id,
	})

	if (errorPickingRandomCard) {
		throw redirectDocument(`/${language}?ts?=${Date.now()}`)
	}

	const {
		prevPickedCards: nextHistory,
		id,
		upsideDown: nextCardUpsideDown,
	} = result
	const card = cardsSet.find((card) => card.id === id)
	if (!card) {
		console.error('Critical: cannot find picked card in cards set')
		throw redirectDocument(`/${language}?ts?=${Date.now()}`)
	}
	setPrevPickedCards(nextHistory)

	return json({
		card,
		upsideDown: nextCardUpsideDown,
	})
}
