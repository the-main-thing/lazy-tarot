import { forwardRef, memo } from 'react'
import { animated } from '@react-spring/web'

import { BodyBottomPortal } from '~/components/BodyBottomPortal'

import { useAnimation } from './useAnimation'
import { useAnimateTo } from './position'

type Props = {
	target: Element | null
	children: React.ReactNode
	className?: string
	trackForMs?: number
}

const containersStyles = {
	position: 'absolute',
	top: '-200vh',
	left: '-200vw',
} as const

const AnimateTo = memo(
	forwardRef<HTMLDivElement | null, Props>(
		({ target, children, className, trackForMs }, ref) => {
			// const [style, setBase] = useAnimation(target, trackForMs)
			const [style, setBase] = useAnimateTo(target, 1000)

			const animatedContainerClassName = `absolute inline-flex top-0 left-0 origin-top-left ${
				className || ''
			}`

			return (
				<div
					ref={ref}
					className={'flex ' + className || ''}
					style={style}
				>
					<div ref={setBase}>{children}</div>
				</div>
			)
			// return (
			// 	<BodyBottomPortal>
			// 		<div ref={ref} style={containersStyles}>
			// 			<div style={containersStyles}>
			// 				<div
			// 					ref={setBase}
			// 					className={animatedContainerClassName}
			// 				>
			// 					<animated.div
			// 						className={
			// 							'opacity-0 absolute origin-top-left ' +
			// 							className
			// 						}
			// 						style={style}
			// 					>
			// 						{children}
			// 					</animated.div>
			// 				</div>
			// 			</div>
			// 		</div>
			// 	</BodyBottomPortal>
			// )
		},
	),
)

AnimateTo.displayName = 'AnimateTo'

export { AnimateTo }
