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

type Props = {
	srcSet: SrcSet
	rel?: 'preload' | 'prefetch'
}

export const PreloadImg = ({ srcSet, rel = 'prefetch' }: Props) => {
	return (
		<>
			<link rel="prefetch" as="image" imageSrcSet={getSrcSet(srcSet)} />
			<link rel={rel} as="image" href={srcSet.placeholder.src} />
		</>
	)
}
