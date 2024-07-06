import { redirect } from '@remix-run/node'
import type { ActionFunctionArgs } from '@remix-run/node'

import { TAROT_READING_SECTION_ID } from './constants'
import { revealed } from './revealed'

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { language } = params
	if (!language) {
		throw redirect(`/?ts=${Date.now()}`)
	}
	if (revealed(params)) {
		return redirect(`/${language}`)
	}
	const formData = await request.formData()
	const cardId = formData.get('id')
	const upsideDown = formData.get('upside_down')
	if (!cardId || !upsideDown) {
		return redirect(`/${language}`)
	}

	return redirect(
		`/${language}/${cardId}/${upsideDown}#${TAROT_READING_SECTION_ID}`,
	)
}
