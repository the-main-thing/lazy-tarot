import { z } from 'zod'

const schema = z.object({
	id: z.string().min(1),
	upside_down: z.union([z.literal('0'), z.literal('1')]),
})

type Deserialized = z.infer<typeof schema>

export const searchParams = {
	serialize: (
		value: Deserialized,
		searchParams = new URLSearchParams(),
	): URLSearchParams => {
		try {
			const { id, upside_down } = schema.parse(value)
			searchParams.set('id', id)
			searchParams.set('upside_down', upside_down)
			return searchParams
		} catch {
			return searchParams
		}
	},
	deserialize: (searchParams: URLSearchParams): Deserialized | undefined => {
		const id = searchParams.get('id')
		const upside_down = searchParams.get('upside_down')
		try {
			return schema.parse({
				id,
				upside_down,
			})
		} catch {
			return undefined
		}
	},
}
