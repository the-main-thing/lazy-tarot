import { useEffect } from 'react'

export const useHoldScroll = (hold: boolean) => {
	useEffect(() => {
		if (hold) {
			const body = document.body
			if (!body) {
				return
			}
			const currentWidth = body.style.width
			const currentHeight = body.style.height
			const overflow = body.style.overflow

			body.style.width = '100vw'
			body.style.height = '100vh'
			body.style.overflow = 'hidden'

			return () => {
				body.style.width = currentWidth
				body.style.height = currentHeight
				body.style.overflow = overflow
			}
		}
	}, [hold])
}
