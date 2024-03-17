import { z } from 'zod'

const schema = z.object({
	id: z.string().min(1),
	upside_down: z.union([z.literal('0'), z.literal('1')]),
	scroll_to: z.string().min(1).optional(),
})

type Deserialized = z.infer<typeof schema>

export const searchParams = {
	serialize: (
		value: Deserialized,
		searchParams = new URLSearchParams(),
	): URLSearchParams => {
		try {
			const { id, upside_down, scroll_to } = schema.parse(value)
			searchParams.set('id', id)
			searchParams.set('upside_down', upside_down)
			if (scroll_to) {
				searchParams.set('scroll_to', scroll_to)
			}
			return searchParams
		} catch {
			return searchParams
		}
	},
	deserialize: (searchParams: URLSearchParams): Deserialized | undefined => {
		const id = searchParams.get('id')
		const upside_down = searchParams.get('upside_down')
		const scroll_to = searchParams.get('scroll_to')
		try {
			return schema.parse({
				id,
				upside_down,
				scroll_to: scroll_to || undefined,
			})
		} catch {
			return undefined
		}
	},
}
