import { useEffect } from 'react'
import { animated, useTrail } from '@react-spring/web'
import { Form as RemixForm } from '@remix-run/react'

import { PortableText } from '~/components/PortableText'

import { FORM_ID } from './constants'
import type { RevealState } from './useRevealState'

type PortableTextValue = React.ComponentProps<typeof PortableText>['value']

type Props<
	THeader extends PortableTextValue,
	TDescription extends PortableTextValue,
> = {
	header: THeader
	description: TDescription
	state: RevealState['value']
	id: string | undefined
	upsideDown: boolean | undefined
	submitButtonLabel: string
	onSubmit: () => void
}

type SpringConfig = {
	from: { opacity: number; translateX: `${number}%` }
	to: { opacity: number; translateX: `${number}%` }
}
const hidden: ValueOf<SpringConfig> = {
	opacity: 0,
	translateX: '-150%',
}
const visible: ValueOf<SpringConfig> = {
	opacity: 1,
	translateX: '0%',
}

const hiddenSpring: SpringConfig = {
	from: hidden,
	to: hidden,
}
const visibleSpring: SpringConfig = {
	from: visible,
	to: visible,
}
const hideSpring: SpringConfig = {
	from: visible,
	to: hidden,
}
const revealSpring: SpringConfig = {
	from: hidden,
	to: visible,
}

const stateSpringMap: {
	[state in RevealState['value']]: SpringConfig
} = {
	initial_hidden: visibleSpring,
	hidden: revealSpring,
	pre_reveal: hideSpring,
	reveal: hiddenSpring,
	revealed: hiddenSpring,
	initial_revealed: hiddenSpring,
	pre_hide: hiddenSpring,
	hide: hiddenSpring,
}

export const Form = <
	THeader extends PortableTextValue,
	TDescription extends PortableTextValue,
>({
	header,
	description,
	state,
	id,
	upsideDown,
	onSubmit,
	submitButtonLabel,
}: Props<THeader, TDescription>) => {
	const spring = useTrail(2, stateSpringMap[state])
	const formDisabled = state !== 'initial_hidden' && state !== 'hidden'

	useEffect(() => {
		if (state === 'hidden') {
			const frameId = window.requestAnimationFrame(() => {
				onSubmit()
			})

			return () => {
				window.cancelAnimationFrame(frameId)
			}
		}
	}, [state, onSubmit])

	return (
		<RemixForm
			method="POST"
			id={FORM_ID}
			onSubmit={(event) => {
				event.preventDefault()
				onSubmit()
			}}
			preventScrollReset
			aria-disabled={formDisabled ? 'true' : 'false'}
			className="w-full text-center"
		>
			{id ? <input type="hidden" name="id" value={id} /> : null}
			{typeof upsideDown === 'boolean' ? (
				<input
					type="hidden"
					name="upside_down"
					value={upsideDown ? '1' : '0'}
				/>
			) : null}
			<animated.div style={spring[1]}>
				<PortableText value={header} />
			</animated.div>
			<animated.div style={spring[0]}>
				<PortableText value={description} />
			</animated.div>
			<button
				className="sr-only"
				type="submit"
				aria-disabled={formDisabled ? 'true' : 'false'}
				tabIndex={formDisabled ? -1 : 0}
			>
				{submitButtonLabel}
			</button>
		</RemixForm>
	)
}
