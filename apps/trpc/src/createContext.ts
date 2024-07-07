import { sanity } from '@repo/api'

type Params = {
  sanityStudioProjectId: string
}

export async function createContext({ sanityStudioProjectId }: Params) {
  const sanityClient = sanity.createClient(sanityStudioProjectId)
  const { createClient, getRunQuery, ...rest } = sanity
  return {
    sanity: {
      ...rest,
      client: sanityClient,
      runQuery: sanity.getRunQuery(sanityClient),
    },
  }
}
export type Context = Awaited<ReturnType<typeof createContext>>
