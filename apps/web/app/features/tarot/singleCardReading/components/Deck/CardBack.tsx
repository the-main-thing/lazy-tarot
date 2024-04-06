import { memo } from 'react'

import { Img, type ImgProps } from '~/components'

interface Props {
	face: React.ReactNode
	back: ImgProps['src']
	className?: string
	style?: React.ComponentProps<'div'>['style']
}

export const CardBack = memo(({ back, className, style, face }: Props) => {
	return (
		<div
			className={
				className +
				' ' +
				'relative w-full h-full overflow-hidden flex flex-col items-center flex-0'
			}
			style={style}
		>
			<div className="opacity-0 w-full h-full">{face}</div>
			<Img
				className="absolute top-0 left-0 w-full h-full"
				src={back}
				alt=""
				aria-hidden="true"
			/>
		</div>
	)
})

CardBack.displayName = 'CardBack'
