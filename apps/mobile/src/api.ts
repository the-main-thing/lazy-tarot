import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'

import type { AppRouter } from '../../trpc/src/router'

const endpoint = (() => {
	const endpoint = import.meta.env.VITE_PUBLIC_API_ENDPOINT
	return `${endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint}/trpc`
})()

export const trpc = createTRPCReact<AppRouter>()

export const api = trpc.createClient({
	links: [
		httpBatchLink({
			url: endpoint,
			headers: {
				'x-api-key': import.meta.env.VITE_PUBLIC_API_KEY,
			},
		}),
	],
})
