import { parse } from 'accept-language-parser'

import { defaultLanguage, SUPPORTED_LANGUAGES } from '@repo/core'

export const dir = (_lang: string): Language['dir'] => 'ltr'

type Language = {
	code: (typeof SUPPORTED_LANGUAGES)[number]
	dir: 'rtl' | 'ltr'
}

const DEFAULT_LANGUAGE = {
	code: defaultLanguage,
	dir: dir(defaultLanguage),
} as const

export const getDefaultLanguage = () => DEFAULT_LANGUAGE

const getLanguagesFromHeaders = (
	headers: Headers,
): NonEmptyArray<Language> | null => {
	const acceptLanguageHeader = headers.get('Accept-Language')
	if (!acceptLanguageHeader) {
		return null
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

	return parsedLanugages.length ? parsedLanugages : null
}

export const getLanguageFromHeaders = (headers: Headers) => {
	return getLanguagesFromHeaders(headers)?.[0] || null
}

export const getLanguageFromParams = (
	params: Record<string, string | undefined>,
): Language | null => {
	const code = params.language as Language['code'] | undefined
	if (!code || !SUPPORTED_LANGUAGES.includes(code as never)) {
		return null
	}

	return {
		code,
		dir: dir(code),
	}
}
