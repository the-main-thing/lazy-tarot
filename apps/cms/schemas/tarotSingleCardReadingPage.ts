import {defineType} from 'sanity'

const tarotOfTheDayPage = defineType({
  name: 'tarotOfTheDayPage',
  type: 'document',
  title: 'Tarot of the day page content',
  description:
    'There is no SEO title or description for this page because these will be taken from the tarot card of the day.',
  preview: {
    select: {
      title: 'title',
    },
    prepare(_) {
      return {
        title: 'Tarot of the day page',
      }
    },
  },
  fields: [
    {
      name: 'header',
      title: 'Page header',
      type: 'internationalizedArrayFormattedText',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'descriptionTitle',
      title: 'Titile for the full description section',
      type: 'internationalizedArrayFormattedText',
      validation: (Rule) => Rule.required(),
    },
  ],
})

export const definitions = [tarotOfTheDayPage]
