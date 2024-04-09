import {
	useLoaderData,
	Link,
	type ClientLoaderFunctionArgs,
	type ClientLoaderFunction,
} from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import type {
	MetaFunction,
	HeadersFunction,
	LoaderFunctionArgs,
	SerializeFrom,
} from '@remix-run/node'
import { ClassNames } from '@emotion/react'
import { ClientOnly } from 'remix-utils/client-only'

import { env } from '~/utils/env.server'
import { Img, PortableText, NavigationBar, PreloadImg } from '~/components'
import { TarotReading } from '~/features/tarot/singleCardReading/TarotReading'
import { api } from '~/api.server'
import { loader as tarotReadingLoader } from '~/features/tarot/singleCardReading/loader.server'
import { clientLoader as tarotReadingClientLoader } from '~/features/tarot/singleCardReading/clientLoader.client'
import { useQueryCardsSet } from '~/features/tarot/query'
import { ManifestoPage } from '~/features/manifesto/ManifestoPage'
import { AboutUsPage } from '~/features/aboutUs/AboutUsPage'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const host = env('PUBLIC_HOST')
	const language = params.language
	if (!language) {
		throw redirect('/')
	}
	const [pages, { data: tarotReadingData, headers }] = await Promise.all([
		api.pages.public.getAllPages.query({
			language,
		}),
		tarotReadingLoader({ request, params }),
	])

	return json(
		{
			host,
			pages,
			...tarotReadingData,
		},
		{
			headers,
		},
	)
}

export const clientLoader = async ({
	serverLoader,
	params,
}: ClientLoaderFunctionArgs) => {
	const clientData = await tarotReadingClientLoader<
		SerializeFrom<typeof loader>
	>({ serverLoader, params })

	return clientData satisfies SerializeFrom<typeof loader>
}
;(clientLoader as ClientLoaderFunction).hydrate = true

export default function Index() {
	const { pages, card, deckSSRData, language, revealed } =
		useLoaderData<typeof clientLoader>()

	const {
		rootLayoutContent,
		indexPageContent,
		tarotReadingPageContent,
		manifestoPageContent,
		aboutUsPageContent,
	} = pages

	const { data: fullCardsSet } = useQueryCardsSet(language)

	return (
		<>
			{card ? (
				<PreloadImg rel="preload" srcSet={card.card.image} />
			) : null}
			<PreloadImg
				rel="preload"
				srcSet={tarotReadingPageContent.cardBackImage}
			/>
			<ClientOnly fallback={null}>
				{() =>
					fullCardsSet?.map((card) => (
						<PreloadImg
							key={card.id}
							rel="prefetch"
							srcSet={card.image}
						/>
					))
				}
			</ClientOnly>

			<div className="w-full md:w-11/12 p-4 pt-10 pb-20 md:pb-40 flex flex-col m-auto gap-16">
				<div id="index">
					<NavigationBar
						tarotReadingLinkTitle={
							rootLayoutContent.tarotReadingLinkTitle
						}
						manifestoLinkTitle={
							rootLayoutContent.manifestoLinkTitle
						}
					/>
				</div>
				<div className="w-full flex flex-col items-center mb-14 gap-4">
					<header>
						<Link
							to={`/${language}?reset=1#tarot-reading`}
							className="pl-1 pr-1 md:pl-0 md:pr-0 md:w-8/12 m-auto text-center"
						>
							<PortableText
								value={indexPageContent.headerTitle}
							/>
							<ClassNames>
								{({ cx, css }) => (
									<div
										className={cx(
											'text-subheader',
											css`
												& * {
													line-height: 0.66em;
												}
											`,
										)}
									>
										<PortableText
											value={
												indexPageContent.headerDescription
											}
										/>
									</div>
								)}
							</ClassNames>
						</Link>
					</header>
					<div className="relative -left-4">
						<div className="w-screen-30 landscape:w-screen-13 relative">
							<Img src={indexPageContent.logo} />
						</div>
					</div>
				</div>
				<TarotReading
					pageContent={tarotReadingPageContent}
					revealed={revealed}
					card={card}
					deckSSRData={deckSSRData}
					language={language}
				/>
				<div />
				<ManifestoPage
					header={manifestoPageContent.header}
					content={manifestoPageContent.content}
					headerImage={manifestoPageContent.headerImage}
				/>
				<AboutUsPage
					header={aboutUsPageContent.header}
					image={aboutUsPageContent.image}
					social={aboutUsPageContent.social}
				/>
			</div>
		</>
	)
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	if (!data) {
		return []
	}

	return [
		{
			name: 'p:domain_verify',
			content: 'fbf457f39435399318cfa0269464d6d5',
		},
		{
			title: data.pages.indexPageContent.title,
		},
		{
			name: 'description',
			content: data.pages.indexPageContent.description,
		},
		{
			property: 'og:title',
			content: data.pages.indexPageContent.title,
		},
		{
			property: 'og:type',
			content: 'website',
		},
		{
			property: 'og:url',
			content: data.host,
		},
		{
			property: 'og:image',
			content: `${
				data.host.endsWith('/') ? data.host : data.host + '/'
			}og-image.png`,
		},
		{
			property: 'og:image:width',
			content: '1200',
		},
		{
			property: 'og:image:height',
			content: '630',
		},
		{
			property: 'og:description',
			content: data.pages.indexPageContent.description,
		},
		{
			property: 'og:locale',
			content: data.language,
		},
	].concat(data.pages.rootLayoutContent.ogData)
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	return loaderHeaders
}
