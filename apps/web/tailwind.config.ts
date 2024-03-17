import defaultTheme from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss'

const sizes = [
	0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
	95, 100,
] as const
type Size = (typeof sizes)[number]
type GetSize<TKey extends string> = TKey extends `${string}-${infer size}`
	? size
	: never
type GetKey<
	TKeyPrefix extends string,
	TSize extends Size,
> = `${TKeyPrefix}-${TSize}`

const getSizes = <TKeyPrefix extends string, TUnit extends string>(
	key: TKeyPrefix,
	unit: TUnit,
) => {
	return Object.fromEntries(
		sizes.map((size) => [`${key}-${size}`, `${size}${unit}`]),
	) as {
		[key in GetKey<TKeyPrefix, Size>]: `${GetSize<key>}${TUnit}`
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
			maxHeight: getSizes('screen', 'dvh'),
			height: getSizes('screen', 'dvh'),
			maxWidth: getSizes('screen', 'dvw'),
			width: getSizes('screen', 'dvw'),
		},
	},
	plugins: [],
} satisfies Config
