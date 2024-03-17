export type Position = {
	x: number
	y: number
	width: number
	height: number
}

export const fromRect = (rect: DOMRect): Position => {
	const body = document.body
	const documentElement = document.documentElement

	const scrollTop =
		window.scrollY || documentElement.scrollTop || body.scrollTop
	const scrollLeft =
		window.scrollX || documentElement.scrollLeft || body.scrollLeft

	const clientTop = documentElement.clientTop || body.clientTop || 0
	const clientLeft = documentElement.clientLeft || body.clientLeft || 0

	return {
		x: rect.left + scrollLeft - clientLeft,
		y: rect.top + scrollTop - clientTop,
		width: rect.width,
		height: rect.height,
	}
}
export const fromElement = (element: Element): Position =>
	fromRect(element.getBoundingClientRect())

export const equals = (a: Position, b: Position) =>
	a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
