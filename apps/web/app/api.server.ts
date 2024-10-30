import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../trpc/src/router'

import { env } from './utils/env.server'

const endpoint = (() => {
	const endpoint = env('API_ENDPOINT')
	return `${endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint}/trpc`
})()

export const api = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: endpoint,
			headers: {
				'x-api-key': env('LAZY_TAROT_API_KEY'),
			},
		}),
	],
})
