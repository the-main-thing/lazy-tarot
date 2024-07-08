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

import styles from './tailwind.css?url'

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
				<style
					dangerouslySetInnerHTML={{
						__html: `.body{display:none;}`,
					}}
				/>
				{lang === 'ru' ? (
					<>
						<link
							rel="preload"
							href="/fonts/cormorantgaramond/cyrillicItalic.woff2"
							as="font"
							type="font/woff2"
							crossOrigin="anonymous"
						/>
						<link
							rel="preload"
							href="/fonts/cormorantgaramond/cyrillicRegular.woff2"
							as="font"
							type="font/woff2"
							crossOrigin="anonymous"
						/>
					</>
				) : (
					<>
						<link
							rel="preload"
							href="/fonts/cormorantgaramond/latinItalic.woff2"
							as="font"
							type="font/woff2"
							crossOrigin="anonymous"
						/>
						<link
							rel="preload"
							href="/fonts/cormorantgaramond/latinRegular.woff2"
							as="font"
							type="font/woff2"
							crossOrigin="anonymous"
						/>
					</>
				)}
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<Meta />
				<Links />
				<link
					rel="icon"
					type="image/svg+xml;charset=utf-8"
					href="/favicon.svg"
				/>
				<link rel="stylesheet" href={styles} />
			</head>
			<body
				className="body"
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
