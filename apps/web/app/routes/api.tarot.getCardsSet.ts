import { json } from '@remix-run/node'
import type { LoaderFunctionArgs, SerializeFrom } from '@remix-run/node'

import { api } from '~/api.server'
import { getLanugage } from '~/utils/i18n.server'

const MINUTE_IN_SECONDS = 60

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const language = getLanugage(request.headers)
	const cardsSet = api.tarot.public.getCardsSet.query({
		language,
	})

	return json(cardsSet, {
		headers: {
			'Cache-Control': `public, max-age${
				MINUTE_IN_SECONDS * 30
			}, stale-while-revalidate=${MINUTE_IN_SECONDS * 60 * 3}`,
		},
	})
}

export type Data = SerializeFrom<typeof loader>
