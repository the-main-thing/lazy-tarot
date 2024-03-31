import { forwardRef } from 'react'
import { type BREAKPOINTS } from '@repo/core/breakpoints'
import { srcSet as getSrcSet } from '@repo/core/srcSet'

type Breakpoints = typeof BREAKPOINTS
type Breakpoint<K extends keyof Breakpoints> = Breakpoints[K]

type SrcSet = {
	[breakpoint in keyof Breakpoints]: {
		src: string
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
			<img
				ref={ref}
				alt={alt}
				aria-hidden={alt ? 'false' : 'true'}
				{...props}
				srcSet={getSrcSet(src)}
				src={src.sm.src}
				className={className}
			/>
		)
	},
)

Img.displayName = 'Img'
