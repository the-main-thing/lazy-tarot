import { useEffect } from 'react'
import { animated, useSprings } from '@react-spring/web'

import { PortableText } from '~/components/PortableText'
import { Typography } from '~/components/Typography'

type PortableTextValue = React.ComponentProps<typeof PortableText>['value']

type Props<
	THeader extends PortableTextValue,
	TDescription extends PortableTextValue,
> = {
	header: THeader
	description: TDescription | undefined
	cardTitle: string | undefined
	hidden: boolean
	animate: boolean
	children: React.ReactNode
	animatingNewCard: boolean
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

export const Description = <
	THeader extends PortableTextValue,
	TDescription extends PortableTextValue,
>({
	header,
	description,
	cardTitle,
	hidden: hideDescription,
	animate,
	children,
	animatingNewCard,
}: Props<THeader, TDescription>) => {
	const [spring, api] = useSprings(3, () => {
		const to = hideDescription ? hidden : visible
		const from = hideDescription ? visible : hidden
		return {
			from: animate ? from : to,
			to,
			delay: 0,
		}
	})

	useEffect(() => {
		if (animatingNewCard) {
			api.start(hidden)

			return
		}
		if (!animate) {
			return
		}
		if (!animatingNewCard && !hideDescription) {
			api.start(visible)

			return
		}

		api.start(hideDescription ? hidden : visible)
	}, [hideDescription, animate, api, animatingNewCard])

	return (
		<article aria-hidden={hideDescription ? 'true' : 'false'}>
			<div className="flex flex-col items-center text-center gap-8">
				<animated.div
					style={
						animate
							? spring[0]!
							: hideDescription
							  ? hidden
							  : visible
					}
				>
					<PortableText value={header} />
				</animated.div>
				<animated.div
					style={
						animate
							? spring[1]!
							: hideDescription
							  ? hidden
							  : visible
					}
					className="text-pretty hyphens-auto text-center portrait:hidden"
				>
					<Typography variant="h2">{cardTitle}</Typography>
				</animated.div>
				<div className="flex landscape:flex-row portrait:flex-col-reverse gap-16 md:gap-16">
					<div className="flex flex-col items-center gap-8">
						<animated.div
							style={
								animate
									? spring[1]!
									: hideDescription
									  ? hidden
									  : visible
							}
							className="text-pretty hyphens-auto text-center landscape:hidden"
						>
							<Typography variant="h2">{cardTitle}</Typography>
						</animated.div>
						<animated.div
							style={
								animate
									? spring[2]!
									: hideDescription
									  ? hidden
									  : visible
							}
							className="max-w-text-60 text-pretty hyphens-auto text-justify"
						>
							{description ? (
								<PortableText value={description} />
							) : null}
						</animated.div>
					</div>
					<div className="flex flex-col items-center landscape:items-start">
						{children}
					</div>
				</div>
			</div>
		</article>
	)
}
