import type { Position } from './position'

export type Style = {
	translateX: `${number}px`
	translateY: `${number}px`
	scale: number
}

export const getStyle = ({
	from,
	to,
}: {
	from: Position
	to: Position
}): Style => {
	let scale = 0
	if (from.width) {
		scale = to.width / from.width
	}
	if (from.height) {
		const scaleY = to.height / from.height

		scale = Math.abs(scaleY) > Math.abs(scale) ? scaleY : scale
	}

	return {
		translateX: `${to.x - from.x}px`,
		translateY: `${to.y - from.y}px`,
		scale: scale || 1,
	}
}
