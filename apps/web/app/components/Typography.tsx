import { forwardRef } from 'react'

import { capitalize } from '@repo/utils'

type VariantElementMap = {
	h1: HTMLHeadingElement
	h2: HTMLHeadingElement
	h3: HTMLHeadingElement
	h4: HTMLHeadingElement
	h5: HTMLHeadingElement
	h6: HTMLHeadingElement
	default: HTMLParagraphElement
	span: HTMLSpanElement
}

type Variant = keyof VariantElementMap

/**
 * @param {Variant} variant - default variant is "default" `<p />`
 */
type TypographyProps = {
	children: React.ReactNode
	variant?: Variant
	className?: string
	ellipsis?: boolean
}

const getComponent = <TVariant extends Variant>(
	Variant: TVariant,
): ReturnType<
	typeof forwardRef<
		VariantElementMap[TVariant],
		Omit<TypographyProps, 'variant'>
	>
> => {
	const Tag =
		Variant === 'default'
			? 'p'
			: (Variant as keyof Omit<VariantElementMap, 'default'>)
	const Component = forwardRef<
		VariantElementMap[TVariant],
		Omit<TypographyProps, 'variant'>
	>(({ className = '', ellipsis, ...props }, ref) => {
		return (
			<Tag
				{...props}
				className={
					ellipsis ? 'text-ellipsis ' + className || '' : className
				}
				style={{
					fontFamily: 'Cormorant Garamond',
				}}
				ref={ref as any}
			/>
		)
	})
	Component.displayName = `Typography${capitalize(Variant)}`

	return Component
}

const typographyComponentsMap = {
	h1: getComponent('h1'),
	h2: getComponent('h2'),
	h3: getComponent('h3'),
	h4: getComponent('h4'),
	h5: getComponent('h5'),
	h6: getComponent('h6'),
	default: getComponent('default'),
	span: getComponent('span'),
} as const satisfies {
	[variant in Variant]: ReturnType<typeof getComponent<variant>>
}

type ComponentType<T extends Variant> = ReturnType<
	typeof forwardRef<VariantElementMap[T], TypographyProps>
>

// eslint-disable-next-line react/display-name
export const Typography = forwardRef<HTMLElement, TypographyProps>(
	({ variant = 'default', ...props }, ref) => {
		const Component =
			typographyComponentsMap[variant] || typographyComponentsMap.default

		return <Component {...props} ref={ref as any} />
	},
) as <TVariant extends Variant>(
	...args: Parameters<ComponentType<TVariant>>
) => ReturnType<ComponentType<TVariant>>
;(Typography as any).displayName = 'Typography'
