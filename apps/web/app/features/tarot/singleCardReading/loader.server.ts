import { redirect } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'

import { queryClient } from '~/queryClient.server'
import { api } from '~/api.server'
import { loader as deckLoader } from './components/Deck/loader'

import { searchParams } from './searchParams'
import { pickRandomCard } from '@repo/core/pickRandomCard'

const getPageData = async (
	language: string,
	searchQuery?: ReturnType<typeof searchParams.deserialize>,
) => {
	const [cardsSetArray] = await Promise.all([
		queryClient.fetchQuery({
			queryKey: ['getCardsSet', { language }],
			queryFn: () => api.tarot.public.getCardsSet.query({ language }),
			staleTime: 1000 * 60 * 30, // 30 minutes
		}),
	])
	if (!cardsSetArray.length) {
		return {
			language,
			revealed: false,
			deckSSRData: deckLoader(false),
			card: null,
		}
	}

	const cardsSet = cardsSetArray as NonEmptyArray<
		(typeof cardsSetArray)[number]
	>

	const currentCardContent = searchQuery
		? cardsSet.find((card) => card.id === searchQuery.id)
		: undefined

	if (searchQuery && !currentCardContent) {
		throw redirect(`/${language}`)
	}

	if (!currentCardContent) {
		const card = pickRandomCard({
			prev: [],
			source: cardsSet,
		})

		return {
			language,
			revealed: false,
			deckSSRData: deckLoader(false),
			card,
		}
	}

	return {
		language,
		revealed: true,
		deckSSRData: deckLoader(true),
		card: {
			card: currentCardContent,
			upsideDown: searchQuery?.upside_down === '1',
		},
	}
}

/**
 * @TODO - turn it on on release
 */

// const MINUTE_IN_SECONDS = 60
// const CACHE_CONTROL_VALUE = `public, max-age=${
// 	MINUTE_IN_SECONDS * 10
// }, stale-while-revalidate=${MINUTE_IN_SECONDS * 10 * 1}`

const headers = new Headers()
headers.append('Cache-Control', `no-cache, no-store, must-revalidate`)
// headers.append('Vary', 'Accept-Encoding')
// headers.append('Vary', 'Accept-Language')

export const loader = async ({
	request,
	params,
}: Pick<LoaderFunctionArgs, 'request' | 'params'>) => {
	const { language } = params
	if (!language) {
		throw redirect('/')
	}
	const url = new URL(request.url)
	if (url.searchParams.get('reset') === '1') {
		throw redirect(`/${language}#tarot-reading`)
	}
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
		language,
		searchParams.deserialize(new URL(request.url).searchParams),
	)

	return {
		data,
		headers,
	}
}

export type LoaderData = Awaited<ReturnType<typeof loader>>['data']
