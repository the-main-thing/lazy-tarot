import type { Context } from '../types'

import { cardContentQueryObject } from './cardContentQueryObject.server'
import { translateCard } from './translateCard.server'

type Params = {
	language: string | undefined
	id: string
	context: Context
}

export const queryContent = async (
	{ runQuery, q }: Pick<Params['context']['sanity'], 'q' | 'runQuery'>,
	id: Params['id']
) => {
	try {
		const data = await runQuery(
			q('*')
				.filter(`_type == "tarotCard" && _id == "${id}"`)
				.grab(cardContentQueryObject)
				.slice(0)
		)

		return data as typeof data | null
	} catch (error) {
		console.error('SANITY_ERROR', error)
		throw error
	}
}

export const getCardById = async ({ language, id, context }: Params) => {
	const card = await queryContent(context.sanity, id)

	return card
		? translateCard({
				card,
				language,
				context,
			})
		: null
}
