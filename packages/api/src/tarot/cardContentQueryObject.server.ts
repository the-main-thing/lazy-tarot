import { schemas } from '../sanity/schemas.server'
import { q } from '../sanity/sanity.server'

const descriptionSchema = q.object({
	fullDescription: schemas.i18nBlock,
	shortDescription: schemas.i18n,
})

const variantSchema = q.object({
	title: schemas.i18n,
	description: descriptionSchema,
})

export const cardContentQueryObject = {
	_id: q.string(),
	title: schemas.i18n,
	regular: variantSchema,
	upsideDown: variantSchema,
	image: schemas.image,
}

export type Card = ReturnType<
	ReturnType<typeof q.object<typeof cardContentQueryObject>>['parse']
>
