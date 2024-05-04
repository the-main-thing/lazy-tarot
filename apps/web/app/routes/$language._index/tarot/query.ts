import { useQuery } from '@tanstack/react-query'
import { queryClient } from '~/QueryProvider'

import type { Card } from './types'

const getQueryCardsSetKey = (language: string) =>
	['api/tarot/getCardsSet', language] as const

const getUrl = (lanugage: string) =>
	[window.location.origin, ...getQueryCardsSetKey(lanugage)].join('/')

export const getCardsSet = async (language: string): Promise<Array<Card>> => {
	try {
		const response = await fetch(getUrl(language), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		return await response.json()
	} catch (error) {
		console.error('Error loading cards set', error)

		return []
	}
}

export const getOrFetchCardsSet = async (language: string) => {
	return await queryClient.fetchQuery({
		queryKey: getQueryCardsSetKey(language),
		queryFn: () => getCardsSet(language),
		staleTime: Infinity,
	})
}

export const useQueryCardsSet = (language: string) => {
	return useQuery({
		queryKey: getQueryCardsSetKey(language),
		queryFn: () => getCardsSet(language),
		staleTime: Infinity,
	})
}
