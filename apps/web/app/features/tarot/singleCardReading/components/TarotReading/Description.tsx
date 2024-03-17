import { animated, useSpring } from '@react-spring/web'
import { ClassNames } from '@emotion/react'

import { PortableText } from '~/components/PortableText'
import { Typography } from '~/components/Typography'

import type { RevealState } from './useRevealState'

type PortableTextValue = React.ComponentProps<typeof PortableText>['value']

type Props<
	THeader extends PortableTextValue,
	TDescription extends PortableTextValue,
> = {
	header: THeader
	description: TDescription
	state: RevealState['value']
	cardTitle: string
}

type SpringConfig = {
	from: { opacity: number; scale: number }
	to: { opacity: number; scale: number }
}
const hidden: ValueOf<SpringConfig> = {
	opacity: 0,
	scale: 0.8,
}
const visible: ValueOf<SpringConfig> = {
	opacity: 1,
	scale: 1,
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
	initial_hidden: hiddenSpring,
	hidden: hiddenSpring,
	pre_reveal: hiddenSpring,
	reveal: hiddenSpring,
	revealed: revealSpring,
	initial_revealed: visibleSpring,
	pre_hide: hideSpring,
	hide: hiddenSpring,
}

export const Description = <
	THeader extends PortableTextValue,
	TDescription extends PortableTextValue,
>({
	header,
	description,
	cardTitle,
	state,
}: Props<THeader, TDescription>) => {
	const spring = useSpring(stateSpringMap[state])

	return (
		<animated.article style={spring}>
			<ClassNames>
				{({ css, cx }) => (
					<div
						className={cx(
							'relative flex flex-col gap-2',
							css`
								& h1 {
									margin-top: -0.1823em;
								}
							`,
						)}
					>
						<PortableText value={header} />
						<Typography variant="h2">{cardTitle}</Typography>
					</div>
				)}
			</ClassNames>
			<div style={{ maxWidth: '60ch' }} className="text-pretty">
				<PortableText value={description} />
			</div>
		</animated.article>
	)
}
