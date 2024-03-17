import type { api } from '~/api.server'

export type Card = NonNullable<
	Awaited<ReturnType<(typeof api)['tarot']['public']['getCardById']['query']>>
>

export type CardsSet = NonEmptyArray<Card>

type Pages = Awaited<
	ReturnType<(typeof api)['pages']['public']['getAllPages']['query']>
>

export type PageData = Pick<
	Pages,
	'tarotOfTheDayPageContent' | 'tarotReadingPageContent'
>
