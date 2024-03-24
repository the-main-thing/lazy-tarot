import { useEffect } from 'react'
export const unpauseScroll = () => {
	document.body.classList.remove('overflow-hidden')
}

export const pauseScroll = () => {
	document.body.classList.add('overflow-hidden')

	return unpauseScroll
}

export const useHoldScroll = (hold: boolean) => {
	useEffect(() => {
		if (hold) {
			return pauseScroll()
		}
	}, [hold])
}
