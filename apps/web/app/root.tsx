import { json } from '@remix-run/node'
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	type ShouldRevalidateFunction,
} from '@remix-run/react'
import { useReducedMotion } from '@react-spring/web'
import { Analytics } from '@vercel/analytics/react'

import {
	getLanguageFromParams,
	getLanguageFromHeaders,
	getDefaultLanguage,
} from './utils/i18n.server'

import { QueryProvider } from './QueryProvider'

import './tailwind.css'

export default function Root() {
	useReducedMotion()
	const loaderData = useLoaderData<typeof loader>()
	const {
		language: { lang, dir },
	} = loaderData

	return (
		<html
			lang={lang}
			dir={dir}
			style={{
				fontFamily: 'Cormorant Garamond',
				lineHeight: 1.15,
				tabSize: 4,
				minHeight: '100dvh',
			}}
		>
			<head>
				{lang === 'ru' ? (
					<>
						<link
							rel="preload"
							href="/fonts/cormorantgaramond/cyrillicItalic.woff2"
							as="font"
							type="font/woff2"
						/>
						<link
							rel="preload"
							href="/fonts/cormorantgaramond/cyrillicRegular.woff2"
							as="font"
							type="font/woff2"
						/>
					</>
				) : (
					<>
						<link
							rel="preload"
							href="/fonts/cormorantgaramond/latinItalic.woff2"
							as="font"
							type="font/woff2"
						/>
						<link
							rel="preload"
							href="/fonts/cormorantgaramond/latinRegular.woff2"
							as="font"
							type="font/woff2"
						/>
					</>
				)}
				<style
					dangerouslySetInnerHTML={{
						__html: `@font-face{font-family:'Cormorant Garamond';font-style:italic;font-weight:400;font-display:block;src:local('Cormorant Garamond'), url('/fonts/cormorantgaramond/cyrillicItalic.woff2') format('woff2');unicode-range:U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116}@font-face{font-family:'Cormorant Garamond';font-style:italic;font-weight:400;font-display:block;src:local('Cormorant Garamond'), url('/fonts/cormorantgaramond/latinItalic.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD}@font-face{font-family:'Cormorant Garamond';font-style:normal;font-weight:400;font-display:swap;src:local('Cormorant Garamond'), url('/fonts/cormorantgaramond/cyrillicRegular.woff2') format('woff2');unicode-range:U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116}@font-face{font-family:'Cormorant Garamond';font-style:normal;font-weight:400;font-display:swap;src:local('Cormorant Garamond'), url('/fonts/cormorantgaramond/latinRegular.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD}`,
					}}
				/>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<Meta />
				<Links />
			</head>
			<body
				style={{
					height: '100dvh',
					margin: 0,
					padding: 0,
					fontFamily: 'inherit',
					width: '100vw',
					overflow: 'hidden',
					position: 'relative',
				}}
			>
				{process.env.NODE_ENV === 'production' ? <Analytics /> : null}
				<QueryProvider>
					<Outlet />
				</QueryProvider>
				<ScrollRestoration />
				<Scripts />
				<div id="body-bottom-portal" />
			</body>
		</html>
	)
}

export const meta: MetaFunction = () => [
	{
		name: 'p:domain_verify',
		content: 'fbf457f39435399318cfa0269464d6d5',
	},
]

export const shouldRevalidate: ShouldRevalidateFunction = ({
	currentParams,
	nextParams,
}) => {
	return currentParams.language !== nextParams.language
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { code: language, dir } =
		getLanguageFromParams(params) ||
		getLanguageFromHeaders(request.headers) ||
		getDefaultLanguage()

	return json({
		language: {
			dir,
			lang: language,
		},
	})
}
