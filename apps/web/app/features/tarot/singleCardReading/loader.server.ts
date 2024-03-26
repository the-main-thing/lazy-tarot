import { redirect } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'

import { queryClient } from '~/queryClient.server'
import { api } from '~/api.server'
import { getLanguage } from '~/utils/i18n.server'
import { loader as deckLoader } from './components/TarotReading/Deck/loader'

import { searchParams } from './searchParams'
import { pickRandomCard } from '@repo/utils'

const getPageData = async (
	headers: Headers,
	searchQuery?: ReturnType<typeof searchParams.deserialize>,
) => {
	const language = getLanguage(headers)
	const [cardsSet] = await Promise.all([
		queryClient.fetchQuery({
			queryKey: ['getCardsSet', { language }],
			queryFn: () => api.tarot.public.getCardsSet.query({ language }),
		}),
	])

	const currentCardContent = searchQuery
		? cardsSet.find((card) => card.id === searchQuery.id)
		: undefined

	if (searchQuery && !currentCardContent) {
		throw redirect('/')
	}

	const nextCard = cardsSet.length
		? pickRandomCard({
				prev: [],
				source: cardsSet as NonEmptyArray<(typeof cardsSet)[number]>,
		  })
		: null

	return {
		cardsSet: cardsSet.map((card) => ({ id: card.id })),
		currentCard: currentCardContent
			? {
					card: currentCardContent,
					upsideDown: searchQuery?.upside_down === '1',
			  }
			: null,
		nextCard: nextCard
			? {
					image: nextCard.card.image,
					id: nextCard.card.id,
					upsideDown: nextCard.upsideDown,
			  }
			: null,
		deckSSRData: deckLoader(Boolean(currentCardContent)),
	}
}

const MINUTE_IN_SECONDS = 60
const CACHE_CONTROL_VALUE = `public, max-age=${
	MINUTE_IN_SECONDS * 10
}, stale-while-revalidate=${MINUTE_IN_SECONDS * 10 * 1}`

const headers = new Headers()
headers.append('Cache-Control', CACHE_CONTROL_VALUE)
headers.append('Vary', 'Accept-Encoding')
headers.append('Vary', 'Accept-Language')

export const loader = async ({
	request,
}: Pick<LoaderFunctionArgs, 'request'>) => {
	const url = new URL(request.url)
	const searchQuery = searchParams.deserialize(
		new URL(request.url).searchParams,
	)
	if (searchQuery?.scroll_to) {
		throw redirect(
			`${url.pathname}?${searchParams
				.serialize({
					id: searchQuery.id,
					upside_down: searchQuery.upside_down,
				})
				.toString()}#${searchQuery.scroll_to}`,
		)
	}
	const data = await getPageData(
		request.headers,
		searchParams.deserialize(new URL(request.url).searchParams),
	)

	return {
		data,
		headers,
	}
}

export type LoaderData = Awaited<ReturnType<typeof loader>>['data']
