import { StyleSheet } from 'react-native'

import { Text, type TextProps } from './Themed'

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'default' | 'span'

const styles = StyleSheet.create({
	h1: {
		fontSize: 48,
		lineHeight: 56,
	},
	h2: {
		fontSize: 32,
		lineHeight: 40,
	},
	h3: {
		fontSize: 32,
		lineHeight: 40,
	},
	h4: {
		fontSize: 20,
		lineHeight: 28,
	},
	h5: {
		fontSize: 18,
		lineHeight: 26,
	},
	h6: {
		fontSize: 18,
		lineHeight: 26,
	},
	default: {
		fontSize: 16,
		lineHeight: 24,
	},
	span: {
		fontSize: 16,
		lineHeight: 24,
	},
} satisfies {
	[key in Variant]: Record<string, unknown>
})

const getComponent = <TVariant extends Variant>(variant: TVariant) => {
	return (props: TextProps) => (
		<Text {...props} style={[styles[variant], props.style]} />
	)
}

const componentsMap = {
	h1: getComponent('h1'),
	h2: getComponent('h2'),
	h3: getComponent('h3'),
	h4: getComponent('h4'),
	h5: getComponent('h5'),
	h6: getComponent('h6'),
	default: getComponent('default'),
	span: getComponent('span'),
} satisfies {
	[key in Variant]: ReturnType<typeof getComponent<key>>
}

export const Typography = ({
	variant,
	...props
}: TextProps & { variant: Variant }) => {
	const Component = componentsMap[variant]
	if (!Component) {
		console.error(`Typography variant ${variant} is not supported`)
		return null
	}
	return <Component {...props} />
}
