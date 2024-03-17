import { q } from 'groqd'

export const schemas = {
	image: q.object({
		asset: q.object({
			_ref: q.string(),
		}),
	}),
	i18n: q.array(
		q.object({
			_key: q.string(),
			value: q.string(),
		}),
	),
	i18nBlock: q.array(
		q.object({
			_key: q.string(),
			value: q.contentBlocks(),
		}),
	),
} as const
