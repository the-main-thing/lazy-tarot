import { useQuery } from '@tanstack/react-query'
import { queryClient } from '~/QueryProvider'

import type { Card } from './types'

const getQueryCardsSetKey = () => ['/api/tarot/getCardsSet'] as const

const getUrl = () => `${window.location.origin}${getQueryCardsSetKey()[0]}`

export const getCardsSet = async (): Promise<Array<Card>> => {
	try {
		const response = await fetch(getUrl(), {
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

export const getOrFetchCardsSet = async () => {
	return await queryClient.fetchQuery({
		queryKey: getQueryCardsSetKey(),
		queryFn: getCardsSet,
		staleTime: Infinity,
	})
}

export const useQueryCardsSet = () => {
	return useQuery({
		queryKey: getQueryCardsSetKey(),
		queryFn: () => getCardsSet(),
		staleTime: Infinity,
	})
}
