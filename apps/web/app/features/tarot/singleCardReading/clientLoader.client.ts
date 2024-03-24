import { type ClientLoaderFunctionArgs, redirect } from '@remix-run/react'

import { getOrFetchCardsSet } from '../query'
import { searchParams } from './searchParams'

export const clientLoader = async ({
	request,
}: Pick<ClientLoaderFunctionArgs, 'request'>) => {
	const cardsSet = await getOrFetchCardsSet()
	const parsedSearchParams = searchParams.deserialize(
		new URL(request.url).searchParams,
	)
	const currentCardContent = parsedSearchParams
		? cardsSet.find((card) => card.id === parsedSearchParams.id)
		: undefined

	if (parsedSearchParams && !currentCardContent) {
		throw redirect('/')
	}

	return {
		cardsSet,
		currentCard: currentCardContent
			? {
					card: currentCardContent,
					upsideDown: parsedSearchParams?.upside_down === '1',
			  }
			: null,
		nextCard: null,
	}
}

export type ClientLoaderData = Awaited<ReturnType<typeof clientLoader>>
