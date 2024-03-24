import defaultTheme from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss'

const generateSizes = (min: number, max: number, step: number) => {
	const sizes = [] as Array<number>
	for (let i = min; i <= max; i += step) {
		sizes.push(Math.round(i * 10) / 10)
	}
	return sizes
}
const screenSizes = [
	0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
	95, 100,
] as const
type GetSize<TKey extends string> = TKey extends `${string}-${infer size}`
	? size
	: never
type GetKey<
	TKeyPrefix extends string,
	TSize extends number | string,
> = `${TKeyPrefix}-${TSize}`

const getSizes = <
	TKeyPrefix extends string,
	TUnit extends string,
	TSizes extends Array<string | number> | Readonly<Array<string | number>>,
>({
	prefix,
	unit,
	sizes,
}: {
	prefix: TKeyPrefix
	unit: TUnit
	sizes: TSizes
}) => {
	return Object.fromEntries(
		sizes.map((size) => [`${prefix}-${size}`, `${size}${unit}`]),
	) as {
		[key in GetKey<TKeyPrefix, TSizes[number]>]: `${GetSize<key>}${TUnit}`
	}
}

export default {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				serif: [
					'"Cormorant Garamond"',
					...defaultTheme.fontFamily.serif,
				],
			},
			transitionProperty: {
				underline: 'underline',
			},
			colors: {
				subheader: '#5a7278',
			},
			borderRadius: {
				'2xl': '1.5rem',
			},
			maxHeight: {
				...getSizes({
					prefix: 'screen',
					unit: 'dvh',
					sizes: screenSizes,
				}),
				...getSizes({
					prefix: 'screen-w',
					unit: 'dvw',
					sizes: screenSizes,
				}),
			},
			height: {
				...getSizes({
					prefix: 'screen',
					unit: 'dvh',
					sizes: screenSizes,
				}),
				...getSizes({
					prefix: 'screen-w',
					unit: 'dvw',
					sizes: screenSizes,
				}),
			},
			maxWidth: {
				...getSizes({
					prefix: 'screen',
					unit: 'dvw',
					sizes: screenSizes,
				}),
				...getSizes({
					prefix: 'screen-h',
					unit: 'dvh',
					sizes: screenSizes,
				}),
				...getSizes({
					prefix: 'text',
					unit: 'ch',
					sizes: screenSizes,
				}),
			},
			width: {
				...getSizes({
					prefix: 'screen',
					unit: 'dvw',
					sizes: screenSizes,
				}),
				...getSizes({
					prefix: 'screen-h',
					unit: 'dvh',
					sizes: screenSizes,
				}),
				...getSizes({
					prefix: 'text',
					unit: 'ch',
					sizes: screenSizes,
				}),
			},
			translate: {
				...getSizes({
					prefix: 'em',
					unit: 'em',
					sizes: generateSizes(0.1, 5, 0.1),
				}),
			},
			'-translate': {
				...getSizes({
					prefix: 'em',
					unit: 'em',
					sizes: generateSizes(0.1, 5, 0.1),
				}),
			},
		},
	},
	plugins: [],
} satisfies Config
