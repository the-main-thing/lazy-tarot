import { useState } from 'react'

import { LocalStorage, KEYS } from '~/utils/localStorage'

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

const useSingleCardReadingHook = ({ cardsSet, currentCard }: Props) => {
	const [storage] = useState(() => new LocalStorage())

	return useSingleCardReading({
		cardsSet,
		initialPickedCard: currentCard,
		storage,
		storageKey: KEYS.singleCardReading,
	})
}

export { useSingleCardReadingHook as useSingleCardReading }
