import { useEffect, useRef } from 'react'
import { animated, useSpring } from '@react-spring/web'
import classNames from 'classnames'

import type { RevealState } from './useRevealState'

const pauseScroll = () => {
	document.body.classList.add('overflow-hidden')

	return () => {
		document.body.classList.remove('overflow-hidden')
	}
}

const hidden = { opacity: 0 }
const visible = { opacity: 1 }
const defaultSpring = {
	from: hidden,
	to: hidden,
}

type SpringConf = {
	from: { opacity: number }
	to: { opacity: number }
}

const stateToSpring: {
	[state in RevealState['value']]: SpringConf
} = {
	pre_reveal: {
		from: hidden,
		to: visible,
	},
	pre_hide: {
		from: hidden,
		to: visible,
	},
	reveal: {
		from: visible,
		to: visible,
	},
	hide: {
		from: visible,
		to: visible,
	},
	revealed: {
		from: visible,
		to: hidden,
	},
	hidden: {
		from: visible,
		to: hidden,
	},
	initial_hidden: {
		from: hidden,
		to: hidden,
	},
	initial_revealed: {
		from: hidden,
		to: hidden,
	},
}

const isActiveState: {
	[state in RevealState['value']]?: true
} = {
	pre_reveal: true,
	reveal: true,
	pre_hide: true,
	hide: true,
	hidden: true,
	revealed: true,
}

const getSpring = (state: RevealState['value']) =>
	stateToSpring[state] || defaultSpring

const useHoldScroll = (state: RevealState['value']) => {
	useEffect(() => {
		switch (state) {
			case 'pre_reveal':
			case 'pre_hide':
			case 'reveal':
			case 'hide':
				return pauseScroll()
			default:
				return
		}
	}, [state])
}

const Backdrop = ({
	state,
	onFinish,
}: {
	state: RevealState['value']
	onFinish: () => void
}) => {
	useHoldScroll(state)
	const ref = useRef<HTMLDivElement | null>(null)
	const spring = useSpring({
		...getSpring(state),
		onRest: () => {
			onFinish()
		},
	})

	return (
		<div
			ref={ref}
			className={classNames(
				'absolute pointer-events-none',
				isActiveState[state]
					? ''
					: '-translate-y-full -translatex-full -z-50',
			)}
			aria-hidden="true"
		>
			<animated.div
				style={spring}
				className="opacity-0 fixed inset-0 bg-white pointer-events-none"
			/>
		</div>
	)
}

export const PreReveal = ({
	state,
	onFinish,
}: {
	state: RevealState['value']
	onFinish: () => void
}) => {
	return <Backdrop state={state} onFinish={onFinish} />
}
