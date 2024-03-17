import { redirect } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'

import { api } from '~/api.server'
import { getLanugage } from '~/utils/i18n.server'

import { searchParams } from './searchParams'

const getPageData = async (
	headers: Headers,
	searchQuery?: ReturnType<typeof searchParams.deserialize>,
) => {
	const language = getLanugage(headers)
	const currentCardContent = await (searchQuery
		? api.tarot.public.getCardById.query({
				language,
				id: searchQuery.id,
		  })
		: Promise.resolve(null))

	return {
		cardsSet: currentCardContent ? [currentCardContent] : [],
		currentCard: currentCardContent
			? {
					id: currentCardContent.id,
					upsideDown: searchQuery?.upside_down === '1',
			  }
			: null,
	}
}

const MINUTE_IN_SECONDS = 60
const CACHE_CONTROL_VALUE = `public, max-age=${
	MINUTE_IN_SECONDS * 30
}, stale-while-revalidate=${MINUTE_IN_SECONDS * 60 * 4}`

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
		headers: new Headers({
			'Cache-Control': CACHE_CONTROL_VALUE,
		}),
	}
}

export type LoaderData = Awaited<ReturnType<typeof loader>>['data']
