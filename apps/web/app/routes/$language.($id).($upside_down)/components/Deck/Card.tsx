import { useSpring, animated } from '@react-spring/web'
import { memo, forwardRef } from 'react'
import classnames from 'classnames'

import { Img } from '~/components'
import type { CardsSet } from '~/routes/api.$language.get-full-tarot-set.$build-timestamp/useGetCardsSet'
type Image = CardsSet[number]['image']

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
	onChange?: (revealed: boolean) => void
	sizeClassName: string
	children: React.ReactNode
	back: Image
	front: Image
}

type Ref<T> = Parameters<ReturnType<typeof forwardRef<T>>>[0]['ref']

interface CardAsButtonProps extends Props {
	as: 'button'
	ref?: Ref<HTMLButtonElement>
}

interface CardAsDivProps
	extends Pick<
		Props,
		| 'upsideDown'
		| 'onChange'
		| 'revealed'
		| 'front'
		| 'back'
		| 'sizeClassName'
		| 'style'
		| 'className'
	> {
	as?: 'div'
	ref?: Ref<HTMLDivElement>
}

export type CardProps<TAs extends 'div' | 'button' = 'div'> =
	TAs extends 'button' ? CardAsButtonProps : CardAsDivProps

const backgroundClassName = 'px-1 pt-1 pb-2 bg-slate-50'

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

const backDisplay = (rotateY: number) => (rotateY < 90 ? 'flex' : 'none')
const frontDisplay = (rotateY: number) => (rotateY > 90 ? 'flex' : 'none')
const backRotate = (rotateY: number) =>
	rotateY < 90 ? `rotateY(${rotateY}deg)` : `translate(-1000vw, -1000vh)`
const frontRotate = (rotateY: number) =>
	rotateY > 90
		? `rotateY(${(180 - rotateY) * -1}deg)`
		: `translate(-1000vw, -1000vh)`

const CardInternal = memo(
	forwardRef<HTMLElement, CardProps<'button' | 'div'>>(
		(
			{
				onChange,
				upsideDown,
				revealed,
				front,
				back,
				className,
				sizeClassName,
				...props
			},
			ref,
		) => {
			const spring = useSpring({
				to: {
					rotateY: revealed ? 180 : 0,
				},
				onRest: () => {
					onChange?.(revealed)
				},
			})

			let Component: typeof animated.div | typeof animated.button =
				animated.div
			if ((props as any).as === 'button') {
				Component = animated.button
			}

			return (
				<Component
					ref={ref as never}
					{...(props as any)}
					className={rootContainerClassName(
						sizeClassName,
						props.as === 'button' ? 'will-change-contents' : '',
						className,
					)}
				>
					<Img
						src={front.srcSet.xs.src}
						placeholderSrc={front.srcSet.placeholder.src}
						dimentions={front.dimentions}
						className="sr-only"
						aria-hidden="true"
						alt=""
					/>
					<animated.div
						className={imageContainerClassName(
							sizeClassName,
							props.as === 'button'
								? 'will-change-transform'
								: '',
						)}
						style={{
							display: spring.rotateY.to(backDisplay),
							transform: spring.rotateY.to(backRotate),
						}}
					>
						<Img
							src={back.srcSet.xs.src}
							placeholderSrc={back.srcSet.placeholder.src}
							dimentions={back.dimentions}
							className={'w-full rounded p-0'}
						/>
					</animated.div>
					<animated.div
						className={imageContainerClassName(
							sizeClassName,
							props.as === 'button'
								? 'will-change-transform'
								: '',
						)}
						style={{
							display: spring.rotateY.to(frontDisplay),
							transform: spring.rotateY.to(frontRotate),
						}}
					>
						<Img
							src={front.srcSet.xs.src}
							placeholderSrc={front.srcSet.placeholder.src}
							dimentions={front.dimentions}
							className={
								'w-full rounded p-0 md:hidden' +
								(upsideDown ? ' rotate-180' : '')
							}
						/>
						<Img
							src={front.srcSet.sm.src}
							placeholderSrc={front.srcSet.placeholder.src}
							dimentions={front.dimentions}
							className={
								'w-full rounded p-0 hidden md:block' +
								(upsideDown ? ' rotate-180' : '')
							}
						/>
					</animated.div>
				</Component>
			)
		},
	),
	(prev, next) => {
		const prevKeys = Object.keys(prev) as Array<keyof typeof prev>
		return (
			prevKeys.every((k) => {
				const key = k as keyof typeof prev
				if (key === 'onChange' && prev[key]) {
					return true
				}

				return prev[key] === next[key]
			}) && Object.keys(next).length === prevKeys.length
		)
	},
)

CardInternal.displayName = 'Card'

export const Card = CardInternal as <TAs extends 'div' | 'button'>(
	props: CardProps<TAs>,
) => ReturnType<typeof CardInternal>
