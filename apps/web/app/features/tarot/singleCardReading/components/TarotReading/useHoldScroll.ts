import { useEffect } from 'react'
export const unpauseScroll = () => {
	document.documentElement.classList.remove('overflow-hidden')
}

export const pauseScroll = () => {
	if (!document.documentElement.classList.contains('overflow-hidden')) {
		document.documentElement.classList.add('overflow-hidden')
	}

	return unpauseScroll
}

export const useHoldScroll = (hold: boolean) => {
	useEffect(() => {
		if (hold) {
			return pauseScroll()
		}
	}, [hold])
}
