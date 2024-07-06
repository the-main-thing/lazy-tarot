export type AnimationState =
	| 'idle_ssr_hidden'
	| 'idle_ssr_revealed'
	| 'idle_hidden'
	| 'idle_revealed'
	| 'hiding_pre_animate_scroll'
	| 'hiding_pre_animate_hide_content'
	| 'hiding_wiping_deck_off'
	| 'hiding_replacing_deck'
	| 'hiding_revealing_content'
	| 'revealing_pre_animate_scroll'
	| 'revealing_pre_animate_hide_content'
	| 'revealing_flipping_card'
	| 'revealing_replacing_deck'
	| 'revealing_revealing_content'

export type AnimationEvent = {
	type:
		| 'REVEAL'
		| 'HIDE'
		| 'PREANIMATE_END_SCROLL'
		| 'PREANIMATE_END_HIDE_CONTENT'
		| 'DECK_WIPED_OFF'
		| 'DECK_REPLACED'
		| 'REVEALED_CONTENT_REVEALED'
		| 'HIDDEN_CONTENT_REVEALED'
		| 'CARD_FLIPPED'
}

export type TransitionsMap = {
	[state in AnimationState]: {
		[event in AnimationEvent['type']]?: (
			state: Extract<AnimationState, state>,
			event: Extract<AnimationEvent, { type: event }>,
		) => AnimationState
	}
}

export type StateValueMap<TValue> = {
	[state in AnimationState]?: TValue
}
