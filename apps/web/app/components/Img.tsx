import { forwardRef } from 'react'

interface ImgPropsBase
	extends Omit<
		React.ComponentProps<'img'>,
		'src' | 'srcSet' | 'placeholderSrc' | 'dimentions' | 'ref'
	> {
	src: string
	placeholderSrc: string
	dimentions: [w: number, h: number]
}

export type ImgProps = ImgPropsBase &
	(
		| {
				alt: string
				'aria-hidden': 'true' | 'false'
		  }
		| {
				alt?: undefined
				'aria-hidden'?: 'true'
		  }
	)

export const Img = forwardRef<HTMLImageElement, ImgProps>(
	(
		{ src, dimentions, placeholderSrc, alt = '', className, ...props },
		ref,
	) => {
		return (
			<img
				ref={ref}
				alt={alt}
				aria-hidden={alt ? 'false' : 'true'}
				{...props}
				src={src}
				className={'repo-ui-img ' + className}
				style={{
					backgroundImage: `url(${placeholderSrc})`,
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center center',
					backgroundSize: 'cover',
					aspectRatio: `${dimentions[0]} / ${dimentions[1]}`,
					...props.style,
				}}
			/>
		)
	},
)

Img.displayName = 'Img'
