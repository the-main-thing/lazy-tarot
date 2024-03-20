export const requestIdleCallback = (callback: () => void) => {
	const asTimeout = () => {
		const id = setTimeout(callback, 0)
		return () => clearTimeout(id)
	}
	try {
		const id = window.requestIdleCallback(asTimeout)
		return () => window.cancelIdleCallback(id)
	} catch {
		const id = setTimeout(callback, 0)
		return () => clearTimeout(id)
	}
}
