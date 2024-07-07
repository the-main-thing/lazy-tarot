import { useEffect } from 'react'
import {
	useLoaderData,
	useActionData,
	ShouldRevalidateFunction,
} from '@remix-run/react'
import type { HeadersFunction } from '@remix-run/node'

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

export { loader } from './loader.server'
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
			}, 100)
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
