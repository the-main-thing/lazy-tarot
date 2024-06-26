import { json } from '@remix-run/node'
import type { LoaderFunctionArgs, SerializeFrom } from '@remix-run/node'

import { api } from '~/api.server'
import { queryClient } from '~/queryClient.server'

const MINUTE_IN_SECONDS = 60

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { language } = params
	if (!language) {
		throw json(
			{
				error: 'Missing language parameter',
			},
			{
				status: 400,
			},
		)
	}
	const [cardsSet] = await Promise.all([
		queryClient.fetchQuery({
			queryKey: ['getCardsSet', { language }],
			queryFn: () => api.tarot.public.getCardsSet.query({ language }),
		}),
	])

	return json(cardsSet, {
		headers: {
			'Cache-Control': `public, max-age${
				MINUTE_IN_SECONDS * 30
			}, stale-while-revalidate=${MINUTE_IN_SECONDS * 60 * 3}`,
		},
	})
}

export type Data = SerializeFrom<typeof loader>
