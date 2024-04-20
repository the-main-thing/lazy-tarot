import { useSpring, animated } from '@react-spring/web'
import { useEffect, memo, forwardRef } from 'react'

interface Props {
	face: React.ReactNode
	back: React.ReactNode
	revealed: boolean
}

const SHARED_CARD_STYLE = {
	WebkitBackfaceVisibility: 'hidden',
	backfaceVisibility: 'hidden',
} as const

export const Flip = memo(
	forwardRef<HTMLDivElement, Props>(({ face, back, revealed }, ref) => {
		const [spring, api] = useSpring(() => ({
			from: {
				rotateY: revealed ? 0 : 180,
			},
			to: {
				rotateY: revealed ? 0 : 180,
			},
		}))

		useEffect(() => {
			api.start(() => ({ rotateY: revealed ? 0 : 180 }))
		}, [api, revealed])

		return (
			<div
				ref={ref}
				style={{
					perspective: '1000px',
				}}
			>
				<animated.div
					style={{
						...spring,
						transformStyle: 'preserve-3d',
					}}
					className="relative flex flex-col justify-center items-center"
				>
					<div style={SHARED_CARD_STYLE}>{face}</div>
					<div
						style={{
							...SHARED_CARD_STYLE,
							transform: 'rotateY(180deg)',
						}}
						className="absolute top-0 left-0"
					>
						{back}
					</div>
				</animated.div>
			</div>
		)
	}),
)

Flip.displayName = 'Flip'
