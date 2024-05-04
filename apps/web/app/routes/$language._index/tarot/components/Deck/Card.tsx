import { useSpring, animated } from '@react-spring/web'
import { memo, forwardRef, useEffect } from 'react'
import classnames from 'classnames'

import { type ImgProps, Img } from '~/components'

type ButtonProps = React.ComponentProps<'button'>

interface Props
	extends Pick<
		ButtonProps,
		| 'onClick'
		| 'disabled'
		| 'type'
		| 'style'
		| 'form'
		| 'className'
		| 'aria-disabled'
		| 'id'
		| 'value'
		| 'name'
	> {
	revealed: boolean
	upsideDown: boolean
	sizeClassName: string
	children: React.ReactNode
	back: ImgProps['src']
	front: ImgProps['src']
}

type Ref<T> = Parameters<ReturnType<typeof forwardRef<T>>>[0]['ref']

interface CardAsButtonProps extends Props {
	as: 'button'
	ref?: Ref<HTMLButtonElement>
}

interface CardAsDivProps
	extends Pick<
		Props,
		| 'front'
		| 'back'
		| 'sizeClassName'
		| 'revealed'
		| 'upsideDown'
		| 'style'
		| 'className'
	> {
	as?: 'div'
	ref?: Ref<HTMLDivElement>
}

export type CardProps<TAs extends 'div' | 'button' = 'div'> =
	TAs extends 'button' ? CardAsButtonProps : CardAsDivProps

const backgroundClassName = 'px-1 pt-1 pb-2 bg-slate-500'

const rootContainerClassName = (
	sizeClassName: string,
	...additionalClasses: Array<string | undefined>
) =>
	classnames(
		sizeClassName,
		'relative rounded flex flex-col items-center justify-center shadow-xl',
		...additionalClasses,
	)

const imageContainerClassName = (
	sizeClassName: string,
	...additionalClasses: Array<string | undefined>
) =>
	classnames(
		sizeClassName,
		backgroundClassName,
		'rounded overflow-hidden',
		...additionalClasses,
	)

const backOpacity = (rotateY: number) => (rotateY < 90 ? 1 : 0)
const frontOpacity = (rotateY: number) => (rotateY > 90 ? 1 : 0)
const backRotate = (rotateY: number) =>
	rotateY < 90 ? `rotateY(${rotateY}deg)` : `translate(-1000vw, -1000vh)`
const frontRotate = (rotateY: number) =>
	rotateY > 90
		? `rotateY(${180 - rotateY}deg)`
		: `translate(-1000vw, -1000vh)`

const CardInternal = memo(
	forwardRef<HTMLElement, CardProps<'button' | 'div'>>(
		(
			{
				front,
				back,
				revealed,
				className,
				upsideDown,
				sizeClassName,
				...props
			},
			ref,
		) => {
			const [spring, api] = useSpring(() => {
				return {
					from: {
						rotateY: revealed ? 180 : 0,
					},
					to: {
						rotateY: revealed ? 180 : 0,
					},
				}
			})

			useEffect(() => {
				api.start({ rotateY: revealed ? 180 : 0 })
			}, [revealed, api])

			let Component: typeof animated.div | typeof animated.button =
				animated.div
			if ((props as any).as === 'button') {
				Component = animated.button
			}

			return (
				<Component
					ref={ref as never}
					{...(props as any)}
					className={rootContainerClassName(sizeClassName, className)}
				>
					<animated.div
						className={imageContainerClassName(
							sizeClassName,
							'absolute',
						)}
						style={{
							opacity: spring.rotateY.to(backOpacity),
							transform: spring.rotateY.to(backRotate),
						}}
					>
						<Img src={back} className={'w-full rounded p-0'} />
					</animated.div>
					<animated.div
						className={imageContainerClassName(sizeClassName)}
						style={{
							opacity: spring.rotateY.to(frontOpacity),
							transform: spring.rotateY.to(frontRotate),
						}}
					>
						<Img
							src={front}
							className={
								'w-full rounded p-0' +
								(upsideDown ? ' rotate-180' : '')
							}
						/>
					</animated.div>
				</Component>
			)
		},
	),
)

CardInternal.displayName = 'Card'

export const Card = CardInternal as <TAs extends 'div' | 'button'>(
	props: CardProps<TAs>,
) => ReturnType<typeof CardInternal>
