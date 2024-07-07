export const isElementMostlyVisible = (el: Element | null) => {
	if (!el) {
		return false
	}
	const rect = el.getBoundingClientRect()

	const windowHeight =
		window.innerHeight || document.documentElement.clientHeight
	const windowWidth =
		window.innerWidth || document.documentElement.clientWidth

	const elementHeight = rect.height
	const elementWidth = rect.width

	const vertInView =
		(rect.top >= 0
			? Math.min(rect.bottom, windowHeight) - rect.top
			: rect.bottom - Math.max(0, rect.top)) /
			elementHeight >
		0.5
	const horInView =
		(rect.left >= 0
			? Math.min(rect.right, windowWidth) - rect.left
			: rect.right - Math.max(0, rect.left)) /
			elementWidth >
		0.5

	return vertInView && horInView
}
