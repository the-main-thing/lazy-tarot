export type Position = {
	x: number
	y: number
	width: number
	height: number
}

const getScrollY = () =>
	[
		document.body.scrollTop,
		document.documentElement.scrollTop,
		window.scrollY,
	].filter(Boolean)[0] || 0
const getScrollX = () =>
	[
		document.body.scrollLeft,
		document.documentElement.scrollLeft,
		window.scrollX,
	].filter(Boolean)[0] || 0
const getClientTop = () =>
	[document.body.clientTop, document.documentElement.clientTop].filter(
		Boolean,
	)[0] || 0
const getClientLeft = () =>
	[document.body.clientLeft, document.documentElement.clientLeft].filter(
		Boolean,
	)[0] || 0

export const fromRect = (rect: DOMRect): Position => {
	const scrollTop = getScrollY()
	const scrollLeft = getScrollX()

	const clientTop = getClientTop()
	const clientLeft = getClientLeft()

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
