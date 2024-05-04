import { json, redirect } from '@remix-run/node'
import type {
	LinksFunction,
	MetaFunction,
	LoaderFunctionArgs,
} from '@remix-run/node'
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from '@remix-run/react'
import { SUPPORTED_LANGUAGES } from '@repo/core'
import { Analytics } from '@vercel/analytics/react'

import { getLanguage, dir } from './utils/i18n.server'
import { QueryProvider } from './QueryProvider'
import tailwind from './tailwind.css?url'

export default function Root() {
	const { lang, dir } = useLoaderData<typeof loader>()

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
					height: '100%',
					margin: 0,
					padding: 0,
					fontFamily: 'inherit',
					width: '100vw',
					overflowX: 'hidden',
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

export const loader = ({ request, params }: LoaderFunctionArgs) => {
	const language = params.language || ''
	if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase() as never)) {
		const language = getLanguage(request.headers)
		const currentUrl = new URL(request.url)
		const path = currentUrl.pathname
			.split('/')
			.filter(Boolean)
			.slice(1)
			.join('/')
		let nextPath = `/${language}${path ? `/${path}` : ''}`
		const queryString = currentUrl.searchParams.toString()
		const hash = currentUrl.hash
		if (queryString) {
			nextPath += `?${queryString}`
		}
		if (hash) {
			nextPath += `#${hash}`
		}
		throw redirect(nextPath)
	}

	return json({
		lang: language,
		dir: dir(language),
	})
}

export const shouldRevalidate = () => true

export const links: LinksFunction = () => [
	{
		rel: 'preload',
		href: '/fonts/cormorantgaramond/cyrillicItalic.woff2',
		as: 'font',
		type: 'font/woff2',
	},
	{
		rel: 'preload',
		href: '/fonts/cormorantgaramond/latinItalic.woff2',
		as: 'font',
		type: 'font/woff2',
	},
	{
		rel: 'preload',
		href: '/fonts/cormorantgaramond/cyrillicRegular.woff2',
		as: 'font',
		type: 'font/woff2',
	},
	{
		rel: 'preload',
		href: '/fonts/cormorantgaramond/latinRegular.woff2',
		as: 'font',
		type: 'font/woff2',
	},
	{ rel: 'stylesheet', href: tailwind },
]

export const meta: MetaFunction = () => [
	{
		name: 'p:domain_verify',
		content: 'fbf457f39435399318cfa0269464d6d5',
	},
]
