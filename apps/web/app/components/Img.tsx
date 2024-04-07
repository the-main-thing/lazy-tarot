import { forwardRef } from 'react'
import { type BREAKPOINTS, srcSet as getSrcSet } from '@repo/core'

type Breakpoints = typeof BREAKPOINTS
type Breakpoint<K extends keyof Breakpoints> = Breakpoints[K]

type SrcSet = {
	[breakpoint in keyof Breakpoints]: {
		src: string
		originalDimentions: [width: number, height: number]
		width: Breakpoint<breakpoint>
	}
}

interface ImgPropsBase
	extends Omit<React.ComponentProps<'img'>, 'src' | 'srcSet' | 'ref'> {
	src: SrcSet
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
	({ src, alt = '', className, ...props }, ref) => {
		return (
			<>
				<link rel="preload" as="image" href={src.placeholder.src} />
				<img
					ref={ref}
					alt={alt}
					aria-hidden={alt ? 'false' : 'true'}
					{...props}
					srcSet={getSrcSet(src)}
					src={src.sm.src}
					className={'repo-ui-img ' + className}
					style={{
						backgroundImage: `url(${src.placeholder.src})`,
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center center',
						backgroundSize: 'cover',
						maxWidth: '100%',
						height: 'auto',
						aspectRatio: `${src.sm.originalDimentions[0]} / ${src.sm.originalDimentions[1]}`,
						...props.style,
					}}
				/>
			</>
		)
	},
)

Img.displayName = 'Img'
