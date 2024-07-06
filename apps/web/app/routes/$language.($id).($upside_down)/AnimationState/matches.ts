import type { AnimationState } from './types'

type TruthyStates = Array<AnimationState> | Readonly<Array<AnimationState>>

const match = (statesToMatch: TruthyStates, state: AnimationState) =>
	statesToMatch.includes(state)

export function matches(
	statesToMatch: TruthyStates,
): (state: AnimationState) => boolean
export function matches(
	statesToMatch: TruthyStates,
	state: AnimationState,
): boolean
export function matches(statesToMatch: TruthyStates, state?: AnimationState) {
	if (!state) {
		return (state: AnimationState) => {
			return statesToMatch.includes(state)
		}
	}
	return match(statesToMatch, state)
}
