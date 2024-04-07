import AsyncStorage from '@react-native-async-storage/async-storage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'

import type { AppRouter } from '../../../api'

const endpoint = (() => {
	const endpoint =
		process.env.NODE_ENV === 'development'
			? process.env.EXPO_PUBLIC_DEV_ONLY_API_ENDPOINT
			: process.env.EXPO_PUBLIC_API_ENDPOINT
	if (!endpoint) {
		throw new Error(
			'Environment variable EXPO_PUBLIC_API_ENDPOINT is not defined.'
		)
	}
	return `${endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint}/trpc`
})()

const apiKey = process.env.EXPO_PUBLIC_API_KEY
if (!apiKey) {
	throw new Error('Environment variable EXPO_PUBLIC_API_KEY is not defined.')
}

export const trpc = createTRPCReact<AppRouter>()
export const trpcClient = trpc.createClient({
	links: [
		httpBatchLink({
			url: endpoint,
			// You can pass any HTTP headers you wish here
			async headers() {
				return {
					'x-lazy-tarot-api-key': apiKey,
				}
			},
		}),
	],
})

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			gcTime: Infinity,
		},
	},
})

const asyncStoragePersister = createAsyncStoragePersister({
	storage: AsyncStorage,
})

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<PersistQueryClientProvider
				client={queryClient}
				persistOptions={{ persister: asyncStoragePersister }}
			>
				{children}
			</PersistQueryClientProvider>
		</trpc.Provider>
	)
}
