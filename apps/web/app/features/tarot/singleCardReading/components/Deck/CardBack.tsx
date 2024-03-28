import { memo } from 'react'

interface Props {
	face: React.ReactNode
	url: string
	className?: string
	style?: React.ComponentProps<'div'>['style']
}

export const CardBack = memo(({ url, className, style, face }: Props) => {
	return (
		<div
			className={
				className +
				' ' +
				'relative overflow-hidden flex flex-col items-center flex-0'
			}
			style={style}
		>
			<div className="opacity-0">{face}</div>
			<img
				className="absolute top-0 left-0"
				src={url}
				alt=""
				aria-hidden="true"
			/>
		</div>
	)
})

CardBack.displayName = 'CardBack'
