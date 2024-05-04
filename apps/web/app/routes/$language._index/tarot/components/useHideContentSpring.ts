import { useSpring } from '@react-spring/web'

import type { State } from '../useStateMachine'

const hideContent = {
	opacity: 1,
}
const revealContent = {
	opacity: 0,
}

const stateToSpringMap: {
	[state in State['value']]: {
		from: typeof hideContent | typeof revealContent
		to: typeof hideContent | typeof revealContent
	}
} = {
	initial_hidden: {
		from: revealContent,
		to: revealContent,
	},
	hidden: {
		from: revealContent,
		to: revealContent,
	},
	revealed: {
		from: revealContent,
		to: revealContent,
	},
	initial_revealed: {
		from: revealContent,
		to: revealContent,
	},
	error: {
		from: revealContent,
		to: revealContent,
	},
	hiding: {
		from: hideContent,
		to: hideContent,
	},
	revealing: {
		from: hideContent,
		to: hideContent,
	},
	pre_reveal: {
		from: revealContent,
		to: hideContent,
	},
	pre_hide: {
		from: revealContent,
		to: hideContent,
	},
}

export const useHideContentSpring = ({
	state,
	onStart,
	onRest,
}: {
	state: State['value']
	onStart?: VoidFunction
	onRest?: VoidFunction
}) => {
	return useSpring({
		...stateToSpringMap[state],
		onStart,
		onRest,
	})
}
