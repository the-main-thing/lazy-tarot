import { json, type LoaderFunctionArgs, SerializeFrom } from '@remix-run/node'

import { api } from '~/api.server'
import { queryClient } from '~/queryClient.server'
import { getLanguageFromParams } from '~/utils/i18n.server'

const MINUTE_IN_SECONDS = 60
const HOUR_IN_SECONDS = MINUTE_IN_SECONDS * 60

const getData = async (language: string) => {
	return queryClient.fetchQuery({
		queryKey: ['tarot', 'cards-set', language],
		queryFn: () => api.public.tarot.getCardsSet.query({ language }),
		staleTime: HOUR_IN_SECONDS * 1000,
	})
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const language = getLanguageFromParams(params)?.code
	if (!language) {
		throw new Response(null, { status: 404 })
	}

	return json(await getData(language), {
		headers: {
			'Cache-Control': `public, max-age=${
				HOUR_IN_SECONDS * 3
			}, stale-while-revalidate=${HOUR_IN_SECONDS * 3}`,
		},
	})
}

export type LoaderData = SerializeFrom<typeof loader>
