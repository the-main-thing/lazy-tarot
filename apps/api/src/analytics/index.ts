import { z } from 'zod'

import { publicProcedure } from '../trpc'

const clickSchema = z.object({
  id: z.string(),
  timestamp: z.number().int().positive(),
})

const schema = z.object({
  id: z.string().uuid(),
  clicks: z.array(clickSchema),
})

const saveClicks = publicProcedure.input(schema).mutation(async ({
  input: {
    id,
    clicks,
  },
  ctx: {
    supabase: { db },
  },
}) => {
  await db.from('analytics_clicks').upsert({id, clicks}).select('')
  return 'ok'
})

const getClicks = publicProcedure.input(z.object({
  offset: z.number().int().min(0),
  limit: z.number().int().min(1).max(200),
})).query(async ({ input: {
  offset,
  limit,
}, ctx: {
  supabase: {
    db
  }
} }) => {
  const response = await db.from('analytics_clicks').select('*').range(offset, offset + limit)
  if (response.error) {
    throw response.error
  }

  return response.data
})

export const analytics = {
  saveClicks,
  getClicks,
}