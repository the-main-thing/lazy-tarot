import { json } from '@remix-run/node'

import { api } from '~/api.server'
import type { LoaderFunctionArgs } from '@remix-run/node'

export const action = async ({ request }: LoaderFunctionArgs) => {
	const payload = await request.json()
	api.analytics.saveClicks
		.mutate(payload)
		.catch((e) => console.error('analytics saving error', e))

	return json({
		ok: 'true',
	})
}
