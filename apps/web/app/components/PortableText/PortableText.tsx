import {
	PortableText as PortableTextReact,
	type PortableTextProps,
	type PortableTextReactComponents,
} from '@portabletext/react'
import type { TypedObject, PortableTextBlock } from '@portabletext/types'

import { Typography } from '../Typography'

export type TextBlock<T extends TypedObject = TypedObject> = T

const components = {
	marks: {
		strong: (props) => (
			<Typography variant="span" className="font-bold">
				{props.text}
			</Typography>
		),
	},
	block: {
		h1: ({ children }) => <Typography variant="h1">{children}</Typography>,
		h2: ({ children }) => <Typography variant="h2">{children}</Typography>,
		h3: ({ children }) => <Typography variant="h3">{children}</Typography>,
		h4: ({ children }) => <Typography variant="h4">{children}</Typography>,
		h5: ({ children }) => <Typography variant="h5">{children}</Typography>,
		h6: ({ children }) => <Typography variant="h6">{children}</Typography>,
		p: ({ children }) => (
			<Typography variant="default">{children}</Typography>
		),
		normal: ({ children }) => (
			<Typography variant="default" className="normal">
				{children}
			</Typography>
		),
		italic: ({ children }) => (
			<Typography variant="span" className="italic">
				{children}
			</Typography>
		),
		bold: ({ children }) => (
			<Typography variant="span" className="font-bold">
				{children}
			</Typography>
		),
		span: ({ children }) => (
			<Typography variant="span">{children}</Typography>
		),
		strong: ({ children }) => <Typography>{children}</Typography>,
	},
} as const satisfies Partial<PortableTextReactComponents>

export function PortableText<T extends TypedObject = PortableTextBlock>(
	props: Omit<PortableTextProps<T>, 'components'>,
) {
	return <PortableTextReact {...props} components={components} />
}
