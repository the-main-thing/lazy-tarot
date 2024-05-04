import { useEffect } from 'react'
import { animated, useTrail } from '@react-spring/web'
import { Form as RemixForm } from '@remix-run/react'

import { PortableText } from '~/components/PortableText'

type PortableTextValue = React.ComponentProps<typeof PortableText>['value']

type Props<
	THeader extends PortableTextValue,
	TDescription extends PortableTextValue,
> = {
	header: THeader
	description: TDescription
	cardId: string | undefined
	id: string
	upsideDown: boolean | undefined
	onSubmit: React.FormEventHandler<HTMLFormElement> | undefined
	hidden: boolean
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

export const Form = <
	THeader extends PortableTextValue,
	TDescription extends PortableTextValue,
>({
	header,
	description,
	hidden: hideForm,
	id,
	cardId,
	upsideDown,
	onSubmit,
}: Props<THeader, TDescription>) => {
	const [spring, api] = useTrail(2, () => {
		return {
			from: hideForm ? hidden : visible,
			to: hideForm ? hidden : visible,
			delay: 0,
		}
	})

	useEffect(() => {
		if (hideForm) {
			api.start((i) => {
				return {
					...hidden,
					delay: i * 100,
				}
			})
			return
		}
		if (!hideForm) {
			api.start((i) => {
				return {
					...visible,
					delay: i * 100,
				}
			})
			return
		}
	}, [hideForm, api])

	return (
		<RemixForm
			method="GET"
			id={id}
			onSubmit={onSubmit}
			preventScrollReset
			className="w-full portrait:text-center"
		>
			{hideForm ? <input type="hidden" name="reset" value="1" /> : null}
			{cardId ? <input type="hidden" name="id" value={cardId} /> : null}
			{typeof upsideDown === 'boolean' ? (
				<input
					type="hidden"
					name="upside_down"
					value={upsideDown ? '1' : '0'}
				/>
			) : null}
			<input type="hidden" name="scroll_to" value="tarot-reading" />
			<animated.div
				style={spring[1]}
				className={hideForm ? 'pointer-events-none' : ''}
			>
				<PortableText value={header} />
			</animated.div>
			<animated.div
				style={spring[0]}
				className={hideForm ? 'pointer-events-none' : ''}
			>
				<PortableText value={description} />
			</animated.div>
		</RemixForm>
	)
}
