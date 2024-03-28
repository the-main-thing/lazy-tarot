import { getInitialStylesList, getSSRStyles } from './useAnimate'

export const loader = (revealed: boolean) => {
	const springs = getInitialStylesList({ revealed, animate: false }).map(
		(config) => ({
			to: config.to,
			from: config.to,
		}),
	)
	const style = springs.map((config) => getSSRStyles(config.to))

	return {
		springs,
		style,
	}
}

export type LoaderData = ReturnType<typeof loader>
