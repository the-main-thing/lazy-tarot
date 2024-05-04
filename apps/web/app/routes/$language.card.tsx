import { useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { json } from '@remix-run/node'
import type { HeadersFunction, LoaderFunctionArgs } from '@remix-run/node'
import { Card } from './$language._index/tarot/components/Deck/Card'

import { PreloadImg } from '~/components'
import { api } from '~/api.server'

export const loader = async (_: LoaderFunctionArgs) => {
	const cards = await api.tarot.public.getCardsSet.query({
		language: 'ru',
		slice: [0, 1],
	})
	const pages = await api.pages.public.getAllPages.query({
		language: 'ru',
	})

	if (!cards.length) {
		throw new Error('No cards')
	}

	return json(
		{
			front: cards[0]!.image,
			back: pages.tarotReadingPageContent.cardBackImage,
		},
		{
			headers: {
				'Cache-Control': 'public, max-age=3600',
			},
		},
	)
}

export default function Index() {
	const { front, back } = useLoaderData<typeof loader>()

	const [revealed, setRevealed] = useState(true)

	return (
		<div className="p-4">
			<PreloadImg rel="preload" srcSet={back} />
			<PreloadImg rel="preload" srcSet={front} />
			<Card
				front={front}
				back={back}
				sizeClassName={'landscape:w-screen-h-50 landscape:max-w-screen-22 portrait:w-screen-50 portrait:max-w-screen-h-60'}
				revealed={revealed}
				upsideDown
				onClick={() => {
					console.log('clicked')
					setRevealed((c) => !c)
				}}
			>
				Показать карту
			</Card>
		</div>
	)
}

export const headers: HeadersFunction = () => {
	return new Headers({
		'Cache-control': 'no-store, no-cache, must-revalidate',
	})
}
