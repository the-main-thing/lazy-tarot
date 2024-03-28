import { type ClientLoaderFunctionArgs } from '@remix-run/react'

import { queryClient } from '~/QueryProvider'
import { getOrFetchCardsSet } from '../query'

/**
 * Prevent client from sending following requests to the server
 * since all the logic is done in the browser
 */
export const clientLoader = async <TServerLoaderData>({
	serverLoader,
}: Pick<ClientLoaderFunctionArgs, 'serverLoader'>) => {
	const serverData = await queryClient.fetchQuery<TServerLoaderData>({
		queryKey: [
			window.location.origin,
			{
				page: 'tarotReading',
			},
		],
		queryFn: () => serverLoader() as Promise<TServerLoaderData>,
		staleTime: Infinity,
		gcTime: Infinity,
	})
	// Just start preloading data
	getOrFetchCardsSet()
	return serverData
}

export type ClientLoaderData<TServerLoaderData> = Awaited<
	ReturnType<typeof clientLoader<TServerLoaderData>>
>
