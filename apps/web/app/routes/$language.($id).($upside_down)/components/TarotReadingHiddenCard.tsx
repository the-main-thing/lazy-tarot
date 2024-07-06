import { useEffect, useMemo } from 'react'
import { useTrail, useSpring, animated } from '@react-spring/web'

import { PortableText } from '~/components/PortableText'
import { useRouteLoadersData } from '../RouteLoadersDataProvider'

interface Props {
	children: React.ReactNode
	isVisible: boolean
	className?: string
	onAnimationComplete?: () => void
	onAnimationStart?: () => void
}

export const TarotReadingHiddenCard = ({
	children,
	isVisible,
	className,
	onAnimationComplete,
	onAnimationStart,
}: Props) => {
	const {
		content: { tarotReadingPageContent },
	} = useRouteLoadersData()
	const spring = useFormPageSpring({
		isVisible,
		onAnimationComplete,
		onAnimationStart,
	})
	const containerSpring = useSpring({
		to: {
			opacity: isVisible ? 1 : 0,
		},
	})

	const content = useMemo(() => {
		return (
			<animated.div
				style={containerSpring}
				className="w-full portrait:text-center"
			>
				<animated.div
					style={spring[1]}
					className={isVisible ? '' : 'pointer-events-none'}
				>
					<PortableText value={tarotReadingPageContent.headerTitle} />
				</animated.div>
				<animated.div
					style={spring[0]}
					className={isVisible ? '' : 'pointer-events-none'}
				>
					<PortableText
						value={tarotReadingPageContent.formDescription}
					/>
				</animated.div>
			</animated.div>
		)
	}, [
		containerSpring,
		spring,
		isVisible,
		tarotReadingPageContent.headerTitle,
		tarotReadingPageContent.formDescription,
	])

	return (
		<div
			className={
				'flex flex-col gap-8 items-center w-full ' + (className || '')
			}
		>
			{content}
			{children}
		</div>
	)
}

const hidden = {
	translateX: '-120%',
}
const visible = {
	translateX: '0%',
}

function useFormPageSpring({
	isVisible,
	onAnimationComplete,
	onAnimationStart,
}: Pick<Props, 'isVisible' | 'onAnimationComplete' | 'onAnimationStart'>) {
	const [spring, api] = useTrail(2, () => ({
		from: isVisible ? visible : hidden,
		to: isVisible ? visible : hidden,
		delay: 0,
	}))


	useEffect(() => {
		const to = isVisible ? visible : hidden
		api.start((i) => {
			return {
				...to,
				delay: i * 100,
				onStart: i === 0 ? onAnimationStart : undefined,
				onRest: i === 1 ? onAnimationComplete : undefined,
			}
		})
	}, [api, isVisible, onAnimationComplete, onAnimationStart])

	return spring
}
