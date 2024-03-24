import {
	useLoaderData,
	type ClientLoaderFunctionArgs,
	type ClientLoaderFunction,
} from '@remix-run/react'
import { json } from '@remix-run/node'
import type {
	MetaFunction,
	HeadersFunction,
	LoaderFunctionArgs,
	SerializeFrom,
} from '@remix-run/node'
import { ClassNames } from '@emotion/react'

import { getLanugage } from '~/utils/i18n.server'
import { Img, PortableText, NavigationBar } from '~/components'
import { TarotReading } from '~/features/tarot/singleCardReading/components/TarotReading'
import { api } from '~/api.server'
import { loader as tarotReadingLoader } from '~/features/tarot/singleCardReading/loader.server'
import { clientLoader as tarotReadingClientLoader } from '~/features/tarot/singleCardReading/clientLoader.client'
import { queryClient } from '~/QueryProvider'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const language = getLanugage(request.headers)
	const [pages, { data: tarotReadingData, headers }] = await Promise.all([
		api.pages.public.getAllPages.query({
			language,
		}),
		tarotReadingLoader({ request }),
	])

	return json(
		{
			pages,
			...tarotReadingData,
		},
		{
			headers,
		},
	)
}

export const clientLoader = async ({
	request,
	serverLoader,
}: ClientLoaderFunctionArgs) => {
	const serverData = await queryClient.fetchQuery<
		SerializeFrom<typeof loader>
	>({
		queryKey: [window.location.origin, 'get'],
		queryFn: () => serverLoader(),
		staleTime: Infinity,
		gcTime: Infinity,
	})
	const clientData = await tarotReadingClientLoader({ request })

	return {
		...serverData,
		...clientData,
	} satisfies typeof serverData
}
;(clientLoader as ClientLoaderFunction).hydrate = true

export default function Index() {
	const { pages, cardsSet, currentCard, nextCard, deckSSRData } =
		useLoaderData<typeof clientLoader>()

	const {
		rootLayoutContent,
		indexPageContent,
		tarotOfTheDayPageContent,
		tarotReadingPageContent,
		manifestoPageContent,
	} = pages

	return (
		<div className="w-full md:w-11/12 p-4 pt-10 pb-20 md:pb-40 flex flex-col m-auto gap-16">
			<div id="index">
				<NavigationBar
					tarotReadingLinkTitle={
						rootLayoutContent.tarotReadingLinkTitle
					}
					manifestoLinkTitle={rootLayoutContent.manifestoLinkTitle}
				/>
			</div>
			<div className="w-full flex flex-col items-center mb-14 gap-24">
				<header className="w-8/12 m-auto text-center">
					<PortableText value={indexPageContent.headerTitle} />
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
									value={indexPageContent.headerDescription}
								/>
							</div>
						)}
					</ClassNames>
				</header>
				<Img src={indexPageContent.logo} className="w-screen-40 landscape:w-screen-15 landscape:max-w-screen-h-30" />
			</div>
			{cardsSet?.length > 0 ? (
				<TarotReading
					formContent={tarotReadingPageContent}
					descriptionPageContent={tarotOfTheDayPageContent}
					cardsSet={
						cardsSet as NonEmptyArray<(typeof cardsSet)[number]>
					}
					currentCard={currentCard}
					nextCard={nextCard}
					deckSSRData={deckSSRData}
				/>
			) : null}
			<section id="manifesto">
				<article className="flex flex-col gap-16 w-full max-w-text-60 m-auto items-center">
					<div className="w-full text-center">
						<PortableText value={manifestoPageContent.header} />
					</div>
					<div className="text-pretty text-justify hyphens-auto">
						<PortableText value={manifestoPageContent.content} />
					</div>
				</article>
			</section>
		</div>
	)
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	if (!data) {
		return []
	}
	return [
		{
			title: data.pages.indexPageContent.title,
		},
		{
			name: 'description',
			content: data.pages.indexPageContent.description,
		},
	]
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	return loaderHeaders
}
