import { z } from 'zod'

const booleanSchema = z.union([z.literal('0'), z.literal('1')])

const schema = z.object({
	id: z.string().min(1),
	upside_down: booleanSchema,
	scroll_to: z.string().min(1).optional(),
	reset: booleanSchema.optional(),
})

type Deserialized = z.infer<typeof schema>

export const searchParams = {
	serialize: (
		value: Deserialized,
		searchParams = new URLSearchParams(),
	): URLSearchParams => {
		try {
			const { id, upside_down, scroll_to, reset } = schema.parse(value)
			searchParams.set('id', id)
			searchParams.set('upside_down', upside_down)
			if (scroll_to) {
				searchParams.set('scroll_to', scroll_to)
			}
			if (reset) {
				searchParams.set('reset', reset)
			}
			return searchParams
		} catch {
			return searchParams
		}
	},
	deserialize: (searchParams: URLSearchParams): Deserialized | undefined => {
		const id = searchParams.get('id') || undefined
		const upside_down = searchParams.get('upside_down') || undefined
		const scroll_to = searchParams.get('scroll_to') || undefined
		const reset = searchParams.get('reset') || undefined
		try {
			return schema.parse({
				id,
				upside_down,
				scroll_to: scroll_to || undefined,
				reset,
			})
		} catch {
			return undefined
		}
	},
}
