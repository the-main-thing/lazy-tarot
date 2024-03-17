import { redirect } from '@remix-run/node'
import type { ActionFunctionArgs } from '@remix-run/node'
import { pickRandomCard } from '@repo/utils'

import { api } from '~/api.server'
import { getLanugage } from '~/utils/i18n.server'

import { formDataParser, serializeUpsideDown } from './formDataParser'
import { searchParams } from './searchParams'

export const action = async ({
	request,
}: Pick<ActionFunctionArgs, 'request'>) => {
	const formData = await request.formData()
	const parsedFormData = formDataParser.deserialize(formData)
	// If there is some form data then form submitted with js working
	// and the client already has all the data needed
	if (parsedFormData) {
		return redirect(
			`/?${searchParams
				.serialize(formDataParser.serialize(parsedFormData))
				.toString()}`,
		)
	}

	// No form data submitted. This means that js is not working, or not been hydrated yet
	const parsedSearchParams = searchParams.deserialize(
		new URL(request.url).searchParams,
	)
	const cardsSet = await api.tarot.public.getCardsSet.query({
		language: getLanugage(request.headers),
	})
	if (!cardsSet.length) {
		throw redirect('/')
	}
	const pickedCard = pickRandomCard({
		prev: parsedSearchParams
			? [
					{
						id: parsedSearchParams.id,
						upsideDown: parsedSearchParams.upside_down === '1',
					},
			  ]
			: [],
		source: cardsSet as NonEmptyArray<(typeof cardsSet)[number]>,
	})

	return redirect(
		`/${searchParams
			.serialize({
				id: pickedCard.card.id,
				upside_down: serializeUpsideDown(pickedCard.upsideDown),
			})
			.toString()}`,
	)
}
