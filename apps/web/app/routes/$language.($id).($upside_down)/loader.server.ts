import { json, redirect } from '@remix-run/node'
import { api } from '~/api.server'
import type { LoaderFunctionArgs, SerializeFrom } from '@remix-run/node'
import { getSSRData } from './components/Deck'
import { queryClient } from '~/queryClient.server'

export type Loader = typeof loader

export type LoaderData = SerializeFrom<Loader>

const getContent = (language: string) => {
	return queryClient.fetchQuery({
		queryKey: ['content', language],
		queryFn: () =>
			api.public.pages.getAllPagesData.query({
				language,
			}),
		staleTime: 1000 * 60 * 60, // 1 hour
	})
}

const getCardById = (language: string, id: string) => {
	return queryClient.fetchQuery({
		queryKey: ['tarot', 'card', language, id],
		queryFn: () =>
			api.public.tarot.getCardById.query({
				language,
				id,
			}),
		staleTime: 1000 * 60 * 60, // 1 hour
	})
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { id, upside_down, language } = params
	if (!language) {
		throw redirect('/')
	}
	const contentPromise = getContent(language)

	if (id && (upside_down == '1' || upside_down == '0')) {
		const [card, content] = await Promise.all([
			getCardById(language, id),
			contentPromise,
		])

		if (card) {
			return json({
				card,
				deckSSRData: getSSRData(true),
				content,
				upsideDown: upside_down === '1',
				revealed: true,
				host: new URL(request.url).origin,
				language,
			} as const)
		}

		throw redirect(`/${language}`)
	}

	const [nextCard, content] = await Promise.all([
		api.public.tarot.getRandomCard.query({
			language,
			prevPickedCards: [],
		}),
		contentPromise,
	])

	return json({
		card: nextCard,
		deckSSRData: getSSRData(false),
		content,
		upsideDown: Math.random() > 0.5,
		revealed: false,
		host: new URL(request.url).origin,
		language,
	} as const)
}
