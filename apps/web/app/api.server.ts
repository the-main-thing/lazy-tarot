import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../api'

import { env } from './utils/env.server'

export const api = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: env('API_ENDPOINT'),
		}),
	],
})
