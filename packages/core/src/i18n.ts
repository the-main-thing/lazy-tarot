export const SUPPORTED_LANGUAGES = ['ru', 'en'] as const
export const defaultLanguage = 'ru' as const

type Language = typeof SUPPORTED_LANGUAGES[number]
type Locale = { code: string }

export const getLanguageFromLocales = (locales: Array<Locale>): Language => {
	return (
        (locales.find(({ code }) =>
            (SUPPORTED_LANGUAGES as ReadonlyArray<string>).includes(code),
        )?.code as (typeof SUPPORTED_LANGUAGES)[number]) || defaultLanguage
    )
}