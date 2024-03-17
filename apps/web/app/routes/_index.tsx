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

const CACHE_CONTROL_VALUE = `public, max-age=${
	60 * 60 * 3
}, stale-while-revalidate=${60 * 60 * 3}`

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const language = getLanugage(request.headers)
	const [
		pages,
		{
			data: { cardsSet, currentCard },
		},
	] = await Promise.all([
		api.pages.public.getAllPages.query({
			language,
		}),
		tarotReadingLoader({ request }),
	])

	return json(
		{
			pages,
			currentCard,
			cardsSet,
		},
		{
			headers: {
				'Cache-Control': CACHE_CONTROL_VALUE,
			},
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
	})
	const clientData = await tarotReadingClientLoader({ request })

	return {
		...serverData,
		...clientData,
	} satisfies typeof serverData
}
;(clientLoader as ClientLoaderFunction).hydrate = true

export default function Index() {
	const { pages, cardsSet, currentCard } =
		useLoaderData<typeof clientLoader>()

	const {
		rootLayoutContent,
		indexPageContent,
		tarotOfTheDayPageContent,
		tarotReadingPageContent,
		manifestoPageContent,
	} = pages

	const x = 1

	return (
		<main className="w-full md:w-11/12 p-4 pt-10 pb-20 md:pb-40 flex flex-col m-auto gap-16">
			<div>
				<NavigationBar
					tarotReadingLinkTitle={
						rootLayoutContent.tarotReadingLinkTitle
					}
					manifestoLinkTitle={rootLayoutContent.manifestoLinkTitle}
				/>
				<section
					id="index"
					className="w-full flex flex-col-reverse items-center mb-14"
				>
					<Img
						src={indexPageContent.logo}
						className="w-1/6 -translate-y-1/4 relative -z-10"
					/>
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
										value={
											indexPageContent.headerDescription
										}
									/>
								</div>
							)}
						</ClassNames>
					</header>
				</section>
			</div>
			<TarotReading
				formContent={tarotReadingPageContent}
				descriptionPageContent={tarotOfTheDayPageContent}
				cardsSet={cardsSet}
				currentCard={currentCard}
			/>
			<section id="manifesto">
				<article className="flex flex-col gap-16 w-full items-center">
					<div className="w-full text-center">
						<PortableText value={manifestoPageContent.header} />
					</div>
					<div className="text-pretty" style={{ maxWidth: '65ch' }}>
						<PortableText value={manifestoPageContent.content} />
					</div>
				</article>
			</section>
		</main>
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
