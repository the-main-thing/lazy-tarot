import { useEffect } from 'react'
import { animated, useSprings } from '@react-spring/web'

import { PortableText } from '~/components/PortableText'
import { Typography } from '~/components/Typography'
import { capitalize } from '@repo/utils/capitalize'

type PortableTextValue = React.ComponentProps<typeof PortableText>['value']

type Props<
	THeader extends PortableTextValue,
	TDescription extends PortableTextValue,
> = {
	header: THeader | null
	shortDescription: string | null
	description: TDescription | undefined
	descriptionTitleText: string | undefined | null
	cardTitle: string | undefined
	hidden: boolean
	children: React.ReactNode
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
	shortDescription,
	descriptionTitleText,
	description,
	cardTitle,
	hidden: hideDescription,
	children,
}: Props<THeader, TDescription>) => {
	const [spring, api] = useSprings(3, () => {
		const to = hideDescription ? hidden : visible
		return {
			from: to,
			to,
			delay: 0,
		}
	})

	useEffect(() => {
		if (hideDescription) {
			api.start((i) => {
				return {
					...hidden,
					delay: i * 40,
				}
			})

			return
		}

		api.start((i) => {
			return {
				...visible,
				delay: i * 40,
			}
		})
	}, [hideDescription, api])

	return (
		<article
			aria-hidden={hideDescription ? 'true' : 'false'}
			className="flex flex-col gap-20 portrait:items-center"
		>
			{header ? (
				<animated.div style={spring[0]!}>
					<PortableText value={header} />
				</animated.div>
			) : null}

			<div className="flex landscape:flex-row portrait:flex-col-reverse gap-16 md:gap-16">
				<div className="flex flex-col gap-8">
					<animated.div
						style={spring[1]!}
						className="text-pretty hyphens-auto flex flex-col gap-2"
					>
						<Typography variant="h5" className="italic">
							{cardTitle}
						</Typography>
						{shortDescription ? (
							<Typography variant="default" className="italic">
								{capitalize(shortDescription)}
							</Typography>
						) : null}
					</animated.div>
					<animated.div
						style={spring[2]!}
						className="text-pretty hyphens-auto text-justify flex flex-col gap-8"
					>
						{description ? (
							<>
								{descriptionTitleText ? (
									<Typography variant="h5" className="italic">
										{descriptionTitleText}
									</Typography>
								) : null}
								<PortableText value={description} />
							</>
						) : null}
					</animated.div>
				</div>
				<div className="flex flex-col landscape:items-start items-center portrait:m-auto">
					{children}
				</div>
			</div>
		</article>
	)
}
