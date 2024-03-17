import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../api'

import { env } from './utils/env.server'

const endpoint = (() => {
	const endpoint =
		env('NODE_ENV') === 'development'
			? env('DEV_ONLY_API_ENDPOINT')
			: env('API_ENDPOINT')
	return `${endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint}/trpc`
})()

export const api = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: endpoint,
		}),
	],
})
