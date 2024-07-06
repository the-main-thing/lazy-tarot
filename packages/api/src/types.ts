import type { sanity } from './sanity'

type SanityModule = typeof sanity

type Sanity = Omit<SanityModule, 'getRunQuery' | 'createClient'> & {
	runQuery: ReturnType<SanityModule['getRunQuery']>
	client: ReturnType<SanityModule['createClient']>
}

export type Context = {
	sanity: Sanity
}
