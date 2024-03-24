import { getInitialStylesList, getSSRStyles } from './useDeck'

export const loader = (initialRevealed: boolean) => {
	const springs = getInitialStylesList({ initialRevealed, animate: false }).map(config => ({
		to: config.to,
		from: config.to,
	}))
	const style = springs.map((config) => getSSRStyles(config.to))

	return {
		springs,
		style,
	}
}

export type LoaderData = ReturnType<typeof loader>
