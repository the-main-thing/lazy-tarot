import type { SerializeFrom } from '@remix-run/node'
import { useQuery } from '@tanstack/react-query'
import type { loader as cardsSetLoader } from './route'

type CardsSetLoaderData = SerializeFrom<typeof cardsSetLoader>

export type CardsSet = CardsSetLoaderData

export const getKey = (language: string) => ['cardsSet', language] as const

export const queryCardsSet = async (language: string, ts?: number) => {
	const url = new URL(
		`/api/${language}/get-full-tarot-set/${__BUILD_TIMESTAMP__}`,
		window.location.origin,
	)
	if (ts) {
		url.searchParams.set('ts', String(ts))
	}
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'x-api-key': __API_KEY__,
		},
	})

	if (response.status >= 400) {
		const body = await response.text()
		throw new Error(body)
	}

	return (await response.json()) as CardsSetLoaderData
}

export const useGetCardsSet = (language: string) => {
	return useQuery({
		queryKey: getKey(language),
		queryFn: () => queryCardsSet(language),
		staleTime: Infinity,
		gcTime: Infinity,
	})
}
