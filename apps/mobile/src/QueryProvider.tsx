import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { storage } from './storage'
import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'

import type { AppRouter } from '../../trpc/src/router'

const endpoint = (() => {
	const endpoint = import.meta.env.VITE_PUBLIC_API_ENDPOINT
	return `${endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint}/trpc`
})()

export const api = createTRPCReact<AppRouter>()

const apiClient = api.createClient({
	links: [
		httpBatchLink({
			url: endpoint,
			headers: {
				'x-api-key': import.meta.env.VITE_PUBLIC_API_KEY,
			},
		}),
	],
})

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
		},
	},
})

interface AsyncStorage {
	getItem: (key: string) => Promise<string | null>
	setItem: (key: string, value: string) => Promise<unknown>
	removeItem: (key: string) => Promise<void>
}

const asyncStorage: AsyncStorage = {
	getItem: async key => {
		const [value] = await storage.getItem(key)
		return value
	},
	setItem: async (key, value) => {
		const [result] = await storage.setItem(key, value)
		return result
	},
	removeItem: async key => {
		await storage.removeItem(key)
	},
}

const persister = createAsyncStoragePersister({
	storage: asyncStorage,
})

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<api.Provider client={apiClient} queryClient={queryClient}>
			<PersistQueryClientProvider
				persistOptions={{ persister }}
				client={queryClient}
			>
				{children}
			</PersistQueryClientProvider>
		</api.Provider>
	)
}
