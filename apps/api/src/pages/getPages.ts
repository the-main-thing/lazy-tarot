import { z } from 'zod'
import { BREAKPOINTS } from '@repo/utils'

import { q, schemas, getTranslated, getImagesSet } from '../sanity'
import { publicProcedure } from '../trpc'
import type { Context } from '../context'

type Params = {
  language?: string
  breakpoints: Record<number, number>
  context: Pick<Context, 'sanity'>
}

const getSanityContent = async ({ context }: Pick<Params, 'context'>) => {
  const query = q('').grab({
    rootLayoutContent: q('*')
      .filterByType('rootLayout')
      .grab({
        _id: q.string(),
        manifestoLinkTitle: schemas.i18n,
        tarotReadingLinkTitle: schemas.i18n,
        ogData: q.array(
          q.object({
            property: q.string(),
            content: schemas.i18n,
          }),
        ),
      })
      .slice(0),
    indexPageContent: q('*')
      .filterByType('indexPage')
      .grab({
        _id: q.string(),
        title: schemas.i18n,
        description: schemas.i18n,
        headerTitle: schemas.i18nBlock,
        headerDescription: schemas.i18nBlock,
        logo: schemas.image,
      })
      .slice(0),
    tarotReadingPageContent: q('*')
      .filterByType('tarotReadingPage')
      .grab({
        _id: q.string(),
        headerTitle: schemas.i18nBlock,
        formDescription: schemas.i18nBlock,
        submitButtonLabel: schemas.i18n,
        cardBackImage: schemas.image,
      })
      .slice(0),
    tarotOfTheDayPageContent: q('*')
      .filterByType('tarotOfTheDayPage')
      .grab({
        _id: q.string(),
        header: schemas.i18nBlock,
        descriptionTitle: schemas.i18nBlock,
      })
      .slice(0),
    manifestoPageContent: q('*')
      .filter('_type == "manifestoPage"')
      .grab({
        _id: q.string(),
        content: schemas.i18nBlock,
        header: schemas.i18nBlock,
      })
      .slice(0),
  })

  const content = await context.sanity.runQuery(query)

  return content
}

const translate = (
  { language, context }: Pick<Params, 'language' | 'context'>,
  {
    rootLayoutContent,
    indexPageContent,
    tarotReadingPageContent,
    tarotOfTheDayPageContent,
    manifestoPageContent,
  }: Awaited<ReturnType<typeof getSanityContent>>,
) => {
  const { client } = context.sanity

  return {
    rootLayoutContent: {
      manifestoLinkTitle: getTranslated(
        rootLayoutContent.manifestoLinkTitle,
        language,
      ),
      tarotReadingLinkTitle: getTranslated(
        rootLayoutContent.tarotReadingLinkTitle,
        language,
      ),
      ogData: rootLayoutContent.ogData.map(({ property, content }) => ({
        property,
        content: getTranslated(content, language),
      })),
    },
    indexPageContent: {
      title: getTranslated(indexPageContent.title, language),
      description: getTranslated(indexPageContent.description, language),
      headerTitle: getTranslated(indexPageContent.headerTitle, language),
      headerDescription: getTranslated(
        indexPageContent.headerDescription,
        language,
      ),
      logo: getImagesSet({
        client,
        image: indexPageContent.logo,
        breakpoints: BREAKPOINTS,
      }),
    },
    tarotReadingPageContent: {
      headerTitle: getTranslated(tarotReadingPageContent.headerTitle, language),
      formDescription: getTranslated(
        tarotReadingPageContent.formDescription,
        language,
      ),
      submitButtonLabel: getTranslated(
        tarotReadingPageContent.submitButtonLabel,
        language,
      ),
      cardBackImage: getImagesSet({
        client,
        image: tarotReadingPageContent.cardBackImage,
        breakpoints: BREAKPOINTS,
      }),
    },
    tarotOfTheDayPageContent: {
      header: getTranslated(tarotOfTheDayPageContent.header, language),
      descriptionTitle: getTranslated(
        tarotOfTheDayPageContent.descriptionTitle,
        language,
      ),
    },
    manifestoPageContent: {
      header: getTranslated(manifestoPageContent.header, language),
      content: getTranslated(manifestoPageContent.content, language),
    },
  }
}

export const getPages = publicProcedure
  .input(
    z.object({
      language: z.string().optional(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const sanityData = await getSanityContent({ context: ctx })

    return translate({ ...input, context: ctx }, sanityData)
  })
