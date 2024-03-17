import { memo } from 'react'
import { createPortal } from 'react-dom'

export const BodyBottomPortal = memo(
	({ children }: { children: React.ReactNode }) => {
		const portal =
			typeof document === 'undefined'
				? null
				: document.querySelector('#body-bottom-portal')
		if (portal) {
			return createPortal(children, portal)
		}
	},
)

BodyBottomPortal.displayName = 'BodyBottomPortal'
