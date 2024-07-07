import { BREAKPOINTS } from './breakpoints.js'

type Breakpoints = typeof BREAKPOINTS
type Breakpoint<K extends keyof Breakpoints> = Breakpoints[K]

type SrcSet = {
	dimentions: [w: number, h: number]
	srcSet: {
		[breakpoint in keyof Breakpoints]: {
			src: string
			width: Breakpoint<breakpoint>
		}
	}
}

export const srcSet = (srcSet: SrcSet) =>
	Object.values(srcSet.srcSet)
		.map(({ src, width }) => `${src} ${width}w`)
		.join(', ')
