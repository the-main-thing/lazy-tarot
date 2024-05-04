import { forwardRef } from 'react'
import { animated, useSpring } from '@react-spring/web'

import type { State } from '../useStateMachine'

interface ButtonProps extends React.ComponentProps<'button'> {
	state: Extract<State, { card: NonNullable<State['card']> }>['value']
}

const visible = {
	opacity: 1,
}
const hidden = {
	opacity: 0,
}

const stateStyleMap: {
	[state in State['value']]: {
		from: typeof visible | typeof hidden
		to: typeof visible | typeof hidden
	}
} = {
	initial_hidden: {
		from: hidden,
		to: hidden,
	},
	hidden: {
		from: hidden,
		to: hidden,
	},
	error: {
		from: hidden,
		to: hidden,
	},
	pre_reveal: {
		from: hidden,
		to: hidden,
	},
	pre_hide: {
		from: visible,
		to: hidden,
	},
	revealing: {
		from: hidden,
		to: hidden,
	},
	revealed: {
		from: hidden,
		to: visible,
	},
	initial_revealed: {
		from: visible,
		to: visible,
	},
	hiding: {
		from: hidden,
		to: hidden,
	},
}

export const ResetButton = forwardRef<HTMLButtonElement, ButtonProps>(
	(props, ref) => {
		const spring = useSpring(stateStyleMap[props.state])
		return (
			<animated.button
				{...props}
				ref={ref}
				aria-disabled={
					props.state !== 'revealed' &&
					props.state !== 'initial_revealed'
						? 'true'
						: props['aria-disabled']
				}
				style={{
					...spring,
					...props.style,
					pointerEvents:
						props.state !== 'revealed' &&
						props.state !== 'initial_revealed'
							? 'none'
							: props.style?.pointerEvents,
				}}
			/>
		)
	},
)

ResetButton.displayName = 'ResetButton'
