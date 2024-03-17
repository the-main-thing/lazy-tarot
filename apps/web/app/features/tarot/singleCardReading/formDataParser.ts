import { z } from 'zod'

const upsideDownSerializedSchema = z.union([z.literal('1'), z.literal('0')])

type UpsideDownSerialized = z.infer<typeof upsideDownSerializedSchema>

const pickedCardFormSchema = z.object({
	id: z.string().min(1),
	upside_down: upsideDownSerializedSchema,
})

const pickedCardParsedSchema = z.object({
	id: z.string().min(1),
	upsideDown: z.boolean(),
})

export const serializedSchema = pickedCardFormSchema

export const deserializedSchema = pickedCardParsedSchema

export const serializeUpsideDown = (upsideDown: boolean) =>
	upsideDownSerializedSchema.parse(
		(upsideDown ? '1' : '0') satisfies UpsideDownSerialized,
	)

type SerializedFormData = ReturnType<typeof serializedSchema.parse>
type DeserializedFormData = ReturnType<typeof deserializedSchema.parse>

const serializeFormData = (data: DeserializedFormData): SerializedFormData => {
	if (deserializedSchema.safeParse(data).success) {
		const serialized: SerializedFormData = {
			id: data.id,
			upside_down: serializeUpsideDown(data.upsideDown),
		}

		return serialized
	}

	throw new TypeError(`Invalid form data: ${JSON.stringify(data, null, 2)}`)
}

const deserializeFormData = (
	formData: FormData,
): DeserializedFormData | null => {
	try {
		const id = formData.get('id')
		const upside_down = formData.get('upside_down')
		const serializedFormData = serializedSchema.parse({ id, upside_down })
		return deserializedSchema.parse({
			id: serializedFormData.id,
			upsideDown: serializedFormData.upside_down === '1',
		} satisfies DeserializedFormData)
	} catch {
		return null
	}
}

export const formDataParser = {
	serialize: serializeFormData,
	deserialize: deserializeFormData,
}
