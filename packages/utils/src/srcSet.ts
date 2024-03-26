import { BREAKPOINTS } from './breakpoints.js'

type Breakpoints = typeof BREAKPOINTS
type Breakpoint<K extends keyof Breakpoints> = Breakpoints[K]

type SrcSet = {
	[breakpoint in keyof Breakpoints]: {
		src: string
		width: Breakpoint<breakpoint>
	}
}

export const srcSet = (srcSet: SrcSet) =>
	Object.values(srcSet)
		.map(({ src, width }) => `${src} ${width}w`)
		.join(', ')
