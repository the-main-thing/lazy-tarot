import type { api } from '~/api.server'

export type Card = NonNullable<
	Awaited<ReturnType<(typeof api)['tarot']['public']['getCardById']['query']>>
>

export type ReadyToRenderCard = {
	id: Card['id']
	title: Card['regular']['title'] | Card['upsideDown']['title']
	description:
		| Card['regular']['fullDescription']
		| Card['upsideDown']['fullDescription']
	image: Card['image']
	upsideDown: boolean
}

export type PickedCard = {
	card: Card
	upsideDown: boolean
}

type Pages = Awaited<
	ReturnType<(typeof api)['pages']['public']['getAllPages']['query']>
>

export type PageData = Pick<Pages, 'tarotReadingPageContent'>
