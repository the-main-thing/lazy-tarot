import { z } from 'zod'

import { q } from '../sanity'
import { publicProcedure } from '../trpc'
import type { Context } from '../context'

import { cardContentQueryObject } from './cardContentQueryObject.server'
import { translateCard } from './translateCard.server'

type Params = {
  language: string | undefined
  id: string
  runQuery: Context['sanity']['runQuery']
}

export const queryContent = async (
  runQuery: Params['runQuery'],
  id: Params['id'],
) => {
  try {
    const data = await runQuery(
      q('*')
        .filter(`_type == "tarotCard" && _id == "${id}"`)
        .grab(cardContentQueryObject)
        .slice(0),
    )

    return data as typeof data | null
  } catch (error) {
    console.error('SANITY_ERROR', error)
    throw error
  }
}

export const getCardById = publicProcedure
  .input(
    z.object({
      language: z.string().optional(),
      id: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { language, id } = input
    const getCardsSetParams = {
      language,
      id,
    } as const
    const card = await queryContent(ctx.sanity.runQuery, getCardsSetParams.id)

    return card
      ? await translateCard({
          card,
          language,
          ctx,
        })
      : null
  })
