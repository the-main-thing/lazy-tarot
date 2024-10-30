import { useEffect, useState, startTransition } from 'react'
import { defaultLanguage, getLanguageFromLocales } from '@repo/core'

export const useLanugage = () => {
	const [locale, setLocale] = useState(() => {
		try {
			return getLanguageFromLocales(
				navigator.languages.map(language => ({ code: language }))
			)
		} catch {
			return defaultLanguage
		}
	})

	useEffect(() => {
		const onLanugageChange = () => {
			startTransition(() =>
				setLocale(
					getLanguageFromLocales(
						navigator.languages.map(language => ({
							code: language,
						}))
					)
				)
			)
		}
		onLanugageChange()
		window.addEventListener('languagechange', onLanugageChange)

		return () => {
			window.removeEventListener('languagechange', onLanugageChange)
		}
	}, [])

	return locale
}
