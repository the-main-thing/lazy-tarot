import { forwardRef } from 'react'
import classNames from 'classnames'
import { type useSpringRef } from '@react-spring/web'

import { Flip } from './Flip'
import type { ImgProps } from './Img'
import { Img } from './Img'

type Props = {
	back: ImgProps['src']
	face: ImgProps['src']
	state: 'hidden' | 'revealed' | 'reveal' | 'hide'
	upsideDown: boolean
	onAnimationComplete?: () => void
	imgProps?: Omit<ImgProps, 'src' | 'alt' | 'aria-hidden'>
	springRef?: ReturnType<typeof useSpringRef>
	className?: string
}

export const Card = forwardRef<HTMLDivElement, Props>(
	(
		{
			back,
			face,
			state,
			upsideDown,
			onAnimationComplete,
			imgProps,
			springRef,
			className,
		},
		ref,
	) => {
		const derivedImgProps = {
			...imgProps,
			alt: '',
			'aria-hidden': 'true',
			className: classNames('shadow-lg rounded-md', imgProps?.className),
		} as const
		return (
			<Flip.Horizontaly
				ref={ref}
				springRef={springRef}
				className={className}
				back={<Img {...derivedImgProps} src={back} />}
				face={
					<Img
						{...derivedImgProps}
						className={classNames(
							upsideDown ? 'rotate-180' : '',
							derivedImgProps?.className,
						)}
						src={face}
					/>
				}
				state={state}
				onAnimationComplete={onAnimationComplete}
			/>
		)
	},
)

Card.displayName = 'Card'
