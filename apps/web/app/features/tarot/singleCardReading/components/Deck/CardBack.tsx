import { memo } from 'react'
import { ClassNames } from '@emotion/react'

interface Props {
	face: React.ReactNode
	url: string
	className?: string
	style?: React.ComponentProps<'div'>['style']
}

export const CardBack = memo(({ url, className, style, face }: Props) => {
	return (
		<ClassNames>
			{({ css, cx }) => (
				<div
					className={cx(
						className,
						'flex flex-0',
						css`
							background-image: url(${url});
							background-size: cover;
							background-repeat: no-repeat;
						`,
					)}
					style={style}
				>
					<div className="opacity-0">{face}</div>
				</div>
			)}
		</ClassNames>
	)
})

CardBack.displayName = 'CardBack'
