import { forwardRef } from 'react'
import { animated } from '@react-spring/web'

import { BodyBottomPortal } from '~/components/BodyBottomPortal'

import { useAnimation } from './useMovement'

type Props = {
	target: Element | null
	children: React.ReactNode
	className?: string
}

const containersStyles = {
	position: 'absolute',
	top: '-200vh',
	left: '-200vw',
} as const

const AnimateTo = forwardRef<HTMLDivElement | null, Props>(
	({ target, children, className }, ref) => {
		const [style, setBase] = useAnimation(target)

		const animatedContainerClassName = `absolute inline-flex top-0 left-0 origin-top-left ${
			className || ''
		}`
		return (
			<BodyBottomPortal>
				<div ref={ref} style={containersStyles}>
					<div style={containersStyles}>
						<div
							ref={setBase}
							className={animatedContainerClassName}
						>
							<animated.div
								className={
									'absolute origin-top-left ' + className
								}
								style={style}
							>
								{children}
							</animated.div>
						</div>
					</div>
				</div>
			</BodyBottomPortal>
		)
	},
)

AnimateTo.displayName = 'AnimateTo'

export { AnimateTo }
