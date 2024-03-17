import { z } from 'zod'

import { q } from '../sanity'
import { publicProcedure } from '../trpc'
import type { Context } from '../context'

import { cardContentQueryObject } from './cardContentQueryObject.server'
import { translateCard } from './translateCard.server'

type Slice = [start: number, end: number]

type Params = {
  input: {
    language?: string | undefined
    slice?: Slice | Readonly<Slice> | undefined
  }
  ctx: Pick<Context, 'sanity'>
}

export const queryContent = async ({
  input: { language, slice },
  ctx,
}: Params) => {
  const query = q('*').filterByType('tarotCard').grab(cardContentQueryObject)
  if (slice?.length === 2) {
    query.slice(slice[0], slice[1])
  }
  const data = await ctx.sanity.runQuery(query)
  return data.map((card) =>
    translateCard({
      language,
      card,
      ctx,
    }),
  )
}

export const getCardsSet = publicProcedure
  .input(
    z.object({
      language: z.string().optional(),
      slice: z.tuple([z.number(), z.number()]).optional(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const data = await queryContent({
      input,
      ctx,
    })

    return data
  })
