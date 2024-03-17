import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { BASE_KEYS } from '~/constants/queryKeys'
import { LocalStorage, KEYS } from '~/utils/localStorage.client'

import { useSingleCardReading } from '@repo/utils'
import type { LoaderData } from '../../loader.server'

type CardsSet = NonEmptyArray<LoaderData['cardsSet'][number]>

type Props = {
	cardsSet: CardsSet
	currentCard: {
		id: string
		upsideDown: boolean
	} | null
}

const useSingleCardReadingHook = ({
	cardsSet: initialCardsSet,
	currentCard,
}: Props) => {
	const [storage] = useState(() => new LocalStorage())
	const { data: cardsSet } = useQuery({
		queryKey: [BASE_KEYS.tarot, 'getCardsSet'],
		queryFn: async () => {
			const response = await fetch(
				`${window.location.origin}/api/tarot/getCardsSet`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)

			return response.json() as Promise<CardsSet>
		},
		initialData: initialCardsSet,
		staleTime: Infinity,
	})

	return useSingleCardReading({
		cardsSet,
		initialPickedCard: currentCard,
		storage,
		storageKey: KEYS.singleCardReading,
	})
}

export { useSingleCardReadingHook as useSingleCardReading }
