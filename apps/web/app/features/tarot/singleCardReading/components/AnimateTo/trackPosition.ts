import { isInteger } from '@repo/utils/isInteger'
import { equals, type Position, fromElement } from './position'

export const trackPosition = <TElement extends Element>(
	element: TElement | null,
	onChange: (position: Position, element: TElement) => void,
	trackForMs?: number
) => {
	if (!element) {
		return () => void 0
	}

	let canceled = false
	let frameId: ReturnType<typeof window.requestAnimationFrame> | null = null
	let framesCount = 0
	let lastPosition = fromElement(element)
	let lastChange = Date.now()
	const finishAfter = isInteger(trackForMs) && trackForMs > 0 ? trackForMs : 1000
	const skipFrames = 2
	const onFrame = () => {
		if (canceled) {
			return
		}
		if (Date.now() - lastChange > finishAfter) {
			return
		}
		if (skipFrames % framesCount === 0) {
			framesCount = 0
			const currentPosition = fromElement(element)
			if (!equals(currentPosition, lastPosition)) {
				lastChange = Date.now()
				lastPosition = currentPosition
				onChange(currentPosition, element)
			}
		}
		framesCount += 1
		frameId = window.requestAnimationFrame(onFrame)
	}
	onFrame()
	return () => {
		canceled = true
		if (frameId !== null) {
			window.cancelAnimationFrame(frameId)
		}
	}
}
