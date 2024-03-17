import { ClientLoaderFunctionArgs } from '@remix-run/react'

import { getOrFetchCardsSet } from '../query.client'
import { searchParams } from './searchParams'

export const clientLoader = async ({
	request,
}: Pick<ClientLoaderFunctionArgs, 'request'>) => {
	const cardsSet = await getOrFetchCardsSet()
	const parsedSearchParams = searchParams.deserialize(
		new URL(request.url).searchParams,
	)

	return {
		cardsSet,
		currentCard: parsedSearchParams
			? {
					id: parsedSearchParams.id,
					upsideDown: parsedSearchParams.upside_down === '1',
			  }
			: null,
	}
}

export type ClientLoaderData = Awaited<ReturnType<typeof clientLoader>>
