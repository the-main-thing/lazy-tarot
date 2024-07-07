import { BREAKPOINTS } from '@repo/core'

import type { Card } from './cardContentQueryObject.server'
import type { Context } from '../types'

type Props = {
	language: string | undefined
	card: Card
	context: Context
}

export const translateCard = ({ language, card, context }: Props) => {
	const { getTranslated, getImagesSet, client } = context.sanity
	return {
		id: card._id,
		regular: {
			title: getTranslated(card.regular.title, language),
			shortDescription: getTranslated(
				card.regular.description.shortDescription,
				language
			),
			fullDescription: getTranslated(
				card.regular.description.fullDescription,
				language
			),
		},
		upsideDown: {
			title: getTranslated(card.upsideDown.title, language),
			shortDescription: getTranslated(
				card.upsideDown.description.shortDescription,
				language
			),
			fullDescription: getTranslated(
				card.upsideDown.description.fullDescription,
				language
			),
		},
		image: getImagesSet({
			client,
			image: card.image,
			breakpoints: BREAKPOINTS,
		}),
	}
}
