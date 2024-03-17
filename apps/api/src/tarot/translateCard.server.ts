import { BREAKPOINTS } from '@repo/utils'

import { getTranslated, getImagesSet } from '../sanity'
import type { Card } from './cardContentQueryObject.server'
import type { Context } from '~/context'

type Props = {
  language: string | undefined
  card: Card
  ctx: Pick<Context, 'sanity'>
}

export const translateCard = ({ language, card, ctx }: Props) => ({
  id: card._id,
  regular: {
    title: getTranslated(card.regular.title, language),
    shortDescription: getTranslated(
      card.regular.description.shortDescription,
      language,
    ),
    fullDescription: getTranslated(
      card.regular.description.fullDescription,
      language,
    ),
  },
  upsideDown: {
    title: getTranslated(card.upsideDown.title, language),
    shortDescription: getTranslated(
      card.upsideDown.description.shortDescription,
      language,
    ),
    fullDescription: getTranslated(
      card.upsideDown.description.fullDescription,
      language,
    ),
  },
  image: getImagesSet({
    client: ctx.sanity.client,
    image: card.image,
    breakpoints: BREAKPOINTS,
  }),
})
