export const requestIdleCallback = (callback: () => void) => {
	try {
		const id = window.requestIdleCallback(callback)
		return () => window.cancelIdleCallback(id)
	} catch {
		const id = setTimeout(callback, 100)
		return () => clearTimeout(id)
	}
}
