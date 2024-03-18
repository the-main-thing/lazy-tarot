import { forwardRef } from 'react'
import classNames from 'classnames'

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
