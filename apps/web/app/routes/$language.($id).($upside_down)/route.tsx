import { useEffect } from 'react'
import {
	useLoaderData,
	useActionData,
	ShouldRevalidateFunction,
} from '@remix-run/react'
import type { HeadersFunction, MetaFunction } from '@remix-run/node'

import { TarotReading } from './components/TarotReading'
import { Layout } from './components/Layout'
import { ManifestoPage } from './components/ManifestoPage'
import { AboutUsPage } from './components/AboutUsPage'
import {
	AnimationStateProvider,
	useAnimationState,
	matches,
	type AnimationState,
} from './AnimationState'
import { RouteLoadersDataProvider } from './RouteLoadersDataProvider'
import type { LoaderData } from './loader.server'
import type { ActionData } from './clientAction'
import { loader } from './loader.server'

export { loader }
export { action } from './action.server'
export { clientAction } from './clientAction'

export const shouldRevalidate: ShouldRevalidateFunction = ({ nextUrl }) => {
	return nextUrl.searchParams.has('ts')
}

export const headers: HeadersFunction = () => {
	return {
		'Cache-Control': `public, max-age=${
			// 60 * 60 * 1
			60 * 2
		}, stale-while-revalidate=${
			// 60 * 60 * 24
			60 * 2
		}`,
	}
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
			title: data.content.indexPageContent.title,
		},
		{
			name: 'description',
			content: data.content.indexPageContent.description,
		},
		{
			property: 'og:title',
			content: data.content.indexPageContent.title,
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
			content: data.content.indexPageContent.description,
		},
		{
			property: 'og:locale',
			content: data.language,
		},
	].concat(data.content.rootLayoutContent.ogData)
}

export default function Page() {
	const loaderData = useLoaderData() as LoaderData
	const actionData = useActionData() as ActionData | undefined
	return (
		<RouteLoadersDataProvider loaderData={loaderData}>
			<Layout>
				<AnimationStateProvider actionData={actionData}>
					<TarotReading />
					<div />
					<Manifesto loaderData={loaderData} />
					<About loaderData={loaderData} />
				</AnimationStateProvider>
			</Layout>
		</RouteLoadersDataProvider>
	)
}

const matchVisible = matches([
	'idle_hidden',
	'idle_revealed',
	'idle_ssr_hidden',
	'idle_ssr_revealed',
	'hiding_revealing_content',
	'revealing_revealing_content',
])
const usePreAnimate = (
	state: AnimationState,
	send: (event: { type: 'PREANIMATE_END_HIDE_CONTENT' }) => void,
) => {
	useEffect(() => {
		const hide = !matchVisible(state)
		if (hide) {
			const timeout = setTimeout(() => {
				send({ type: 'PREANIMATE_END_HIDE_CONTENT' })
			}, 200)
			return () => clearTimeout(timeout)
		}
	}, [state, send])

	return !matchVisible(state)
}
function Manifesto({ loaderData }: { loaderData: LoaderData }) {
	const [state, send] = useAnimationState()
	const hide = usePreAnimate(state, send)
	return (
		<ManifestoPage
			hide={hide}
			content={loaderData.content.manifestoPageContent}
		/>
	)
}
function About({ loaderData }: { loaderData: LoaderData }) {
	const [state, send] = useAnimationState()
	const hide = usePreAnimate(state, send)
	return (
		<AboutUsPage
			hide={hide}
			content={loaderData.content.aboutUsPageContent}
		/>
	)
}
