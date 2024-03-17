import { queryClient } from '~/QueryProvider'

import type { CardsSet } from './types'

const getQueryCardsSetKey = () =>
	[`${window.location.origin}/api/tarot/getCardsSet`] as const

export const getCardsSet = async (): Promise<CardsSet> => {
	const response = await fetch(getQueryCardsSetKey()[0], {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return await response.json()
}

export const getOrFetchCardsSet = async () => {
	return await queryClient.fetchQuery({
		queryKey: getQueryCardsSetKey(),
		queryFn: getCardsSet,
	})
}
