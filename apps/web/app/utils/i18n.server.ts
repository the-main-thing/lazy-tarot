import { parse } from 'accept-language-parser'

import { defaultLanguage, SUPPORTED_LANGUAGES } from '@repo/utils'

const dir = (_lang: string): Language['dir'] => 'ltr'

type Language = {
	code: string
	dir: 'rtl' | 'ltr'
}

const DEFAULT_LANGUAGE = {
	code: defaultLanguage,
	dir: dir(defaultLanguage),
} as const

export const getLanguagesFromHeaders = (
	headers: Headers,
): NonEmptyArray<Language> => {
	const acceptLanguageHeader = headers.get('Accept-Language')
	if (!acceptLanguageHeader) {
		return [DEFAULT_LANGUAGE]
	}
	const parsedLanugages = parse(acceptLanguageHeader)
		.map(({ code }) => {
			for (const lang of SUPPORTED_LANGUAGES) {
				if (code.toLowerCase().startsWith(lang)) {
					return {
						code: lang,
						dir: dir(lang),
					}
				}
				if (lang.startsWith(code.toLowerCase())) {
					return {
						code: lang,
						dir: dir(lang),
					}
				}
			}
			return null
		})
		.filter(Boolean)
		.concat(DEFAULT_LANGUAGE) as NonEmptyArray<Language>

	return parsedLanugages
}

export const getLanugage = (
	headers: Headers,
): (typeof SUPPORTED_LANGUAGES)[number] => {
	const languages = getLanguagesFromHeaders(headers)

	return (
		(languages.find(({ code }) =>
			(SUPPORTED_LANGUAGES as ReadonlyArray<string>).includes(code),
		)?.code as (typeof SUPPORTED_LANGUAGES)[number]) || defaultLanguage
	)
}
