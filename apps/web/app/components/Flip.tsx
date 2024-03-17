import { useState, useRef, forwardRef, useMemo } from 'react'
import { useSpring, animated, type useSpringRef } from '@react-spring/web'
import classNames from 'classnames'

type Props = {
	back: React.ReactNode
	face: React.ReactNode
	state: 'hidden' | 'revealed' | 'reveal' | 'hide'
	onAnimationComplete?: () => void
	dir?: 'ltr' | 'rtl'
	className?: string
	springRef?: ReturnType<typeof useSpringRef>
}

const Container = forwardRef<
	HTMLDivElement,
	{
		children: React.ReactNode
		className?: string
	}
>(({ children, className }, ref) => (
	<div
		ref={ref}
		className={classNames(
			'flex flex-col justify-center items-center relative',
			className,
		)}
		style={{
			perspective: '300vw',
		}}
	>
		{children}
	</div>
))

Container.displayName = 'Flip.Horizontaly.Container'

const getOnChange = (ref: { current: HTMLDivElement | null }) => {
	return ({ value: { rotateY } }: { value: any }) => {
		if (
			Math.abs(rotateY) >= 90 &&
			ref.current &&
			ref.current.style.opacity !== '0'
		) {
			ref.current.style.opacity = '0'
		}
		if (
			Math.abs(rotateY) < 90 &&
			ref.current &&
			ref.current.style.opacity !== '1'
		) {
			ref.current.style.opacity = '1'
		}
	}
}

const Horizontaly = forwardRef<HTMLDivElement, Props>(
	(
		{
			back,
			face,
			state,
			dir = 'rtl',
			onAnimationComplete,
			springRef,
			className,
		},
		ref,
	) => {
		const dirModifier = dir === 'rtl' ? -1 : 1
		const [initialState, setInitialState] = useState<typeof state | false>(
			state,
		)
		if (
			typeof window !== undefined &&
			initialState &&
			initialState !== state
		) {
			setInitialState(false)
		}
		const isInitialState = Boolean(initialState)

		const backContainerRef = useRef<HTMLDivElement | null>(null)
		const faceContainerRef = useRef<HTMLDivElement | null>(null)

		const onBackChange = useMemo(
			() => getOnChange(backContainerRef),
			[backContainerRef],
		)
		const onFaceChange = useMemo(
			() => getOnChange(faceContainerRef),
			[faceContainerRef],
		)

		const rotateY = dirModifier * 180
		const backSpring = useSpring({
			ref: springRef,
			from: {
				rotateY,
			},
			to: {
				rotateY: 0,
			},
			reverse:
				isInitialState || state === 'reveal' || state === 'revealed',
			pause: isInitialState,
			onChange: onBackChange,
			onRest: () => {
				onAnimationComplete?.()
			},
		})

		const faceSpring = useSpring({
			from: {
				rotateY: rotateY * -1,
			},
			to: {
				rotateY: 0,
			},
			reverse: isInitialState || state === 'hide' || state === 'hidden',
			pause: isInitialState,
			onChange: onFaceChange,
		})

		const sideClassName = 'inline-flex'
		const hiddenClassName = ' -z-50 opacity-0 pointer-events-none'
		return (
			<Container ref={ref} className={className}>
				<animated.div
					ref={backContainerRef}
					style={backSpring}
					className={classNames(
						sideClassName,
						'relative',
						state === 'revealed' ? hiddenClassName : '',
					)}
				>
					{back}
				</animated.div>
				<animated.div
					ref={faceContainerRef}
					style={faceSpring}
					className={classNames(
						sideClassName,
						'absolute top-0 left-0',
						state === 'hidden' ? hiddenClassName : '',
					)}
				>
					{face}
				</animated.div>
			</Container>
		)
	},
)

Horizontaly.displayName = 'Flip.Horizontaly'

export const Flip = {
	Horizontaly,
}
