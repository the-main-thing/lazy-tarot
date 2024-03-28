import type { SpringValue } from '@react-spring/web'

export interface SpringStyles {
	x: number
	y: number
	z: number
	rotateX: number
	rotateY: number
	rotateZ: number
	rotate: number
	revealRotate: number
	scale: number
	opacity: number
}

export type NonNullableConfig = {
	from: SpringStyles
	to: SpringStyles
	delay?: number
	onRest?: () => void
}

export type SpringProps = {
	[key in keyof SpringStyles]: SpringValue<SpringStyles[key]>
}
