import defaultTheme from 'tailwindcss/defaultTheme'
import { getConfig } from '@repo/utils'

const config = getConfig(defaultTheme)

export default {
	...config,
	content: [
		...config.content,
		'./src/**/*.{html,ts,tsx,js,jsx}',
		'./src/**/*.html',
	],
	purge: {
		content: [
			'./src/**/*.{html,ts,tsx,js,jsx}',
			'./src/**/*.html',
			...config.content,
		],
	},
}
