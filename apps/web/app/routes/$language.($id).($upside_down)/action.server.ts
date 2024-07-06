import { redirect } from '@remix-run/node'
import type { ActionFunctionArgs } from '@remix-run/node'

import { TAROT_READING_SECTION_ID } from './constants'

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { language } = params
	if (!language) {
		throw redirect(`/?ts=${Date.now()}`)
	}
	const formData = await request.formData()
	const revealed = formData.get('revealed') === '1'
	if (revealed) {
		return redirect(`/${language}#${TAROT_READING_SECTION_ID}`)
	}
	const cardId = formData.get('id')
	const upsideDown = formData.get('upside_down')
	if (!cardId || !upsideDown) {
		return redirect(`/${language}#${TAROT_READING_SECTION_ID}`)
	}

	return redirect(
		`/${language}/${cardId}/${upsideDown}#${TAROT_READING_SECTION_ID}`,
	)
}
