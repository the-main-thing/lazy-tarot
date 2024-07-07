import { redirect } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'
import {
	getLanguageFromHeaders,
	getLanguageFromParams,
	getDefaultLanguage,
} from '~/utils/i18n.server'

export const loader = ({ request, params }: LoaderFunctionArgs) => {
	const language = getLanguageFromParams(params)
	if (!language) {
		const derivedLanguage =
			getLanguageFromHeaders(request.headers) || getDefaultLanguage()
		throw redirect(`/${derivedLanguage.code}`)
	}

	return new Response('ok', { status: 200 })
}

export default function Index() {
	return null
}
