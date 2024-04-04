import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

import { createClient as createSanityClient, getRunQuery } from './sanity'
import { Database } from './db/supabase.generated.types'

export async function createContext(
  { req, resHeaders }: FetchCreateContextFnOptions,
  env: {
    SANITY_STUDIO_PROJECT_ID: string
    SUPABASE_URL: string
    SUPABASE_KEY: string
    LAZY_TAROT_API_KEY: string
  },
) {
  const apiKey = req.headers.get('x-lazy-tarot-api-key')
  if (apiKey!== env.LAZY_TAROT_API_KEY) {
    throw new Error('Invalid API Key')
  }
  const db = createSupabaseClient<Database>(env.SUPABASE_URL, env.SUPABASE_KEY)
  const sanityClient = createSanityClient(env.SANITY_STUDIO_PROJECT_ID)
  return {
    req,
    resHeaders,
    supabase: {
      db,
    },
    sanity: {
      client: sanityClient,
      runQuery: getRunQuery(sanityClient),
    },
  }
}
export type Context = Awaited<ReturnType<typeof createContext>>
