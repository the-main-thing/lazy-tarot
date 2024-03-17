import {defineType} from 'sanity'

const tarotCardDescription = defineType({
  name: 'tarotCardDescription',
  title: 'Tarot card description',
  description:
    'Tarot card description. Note that in order to add upside down version you have to create a new card variant.',
  type: 'object',
  validation: (Rule) => Rule.required(),
  fields: [
    {
      name: 'fullDescription',
      title: 'Full description',
      description: "The long version of the card's description",
      type: 'internationalizedArrayFormattedText',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'shortDescription',
      title: 'SEO description',
      description: "The short version of the card's description",
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    },
  ],
})

const tarotCardVariant = defineType({
  name: 'tarotCardVariant',
  type: 'object',
  title: 'Tarot Card variant',
  validation: (Rule) => Rule.required(),
  description:
    'Tarot card data, wich is used to display the card on a page. It could be used in many places not only as tarot of the day.\nNote that in order to add upside down version you have to create a new variant.',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: tarotCardDescription.name,
      validation: (Rule) => Rule.required(),
    },
  ],
})

const tarotCard = defineType({
  name: 'tarotCard',
  type: 'document',
  title: 'Tarot card',
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const {title} = selection
      return {
        title: title[0]?.value || 'Untitled',
      }
    },
  },
  fields: [
    {
      name: 'title',
      title: 'General title, when there is no need to specify if the card is upside down',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'regular',
      title: 'Regular variant',
      type: tarotCardVariant.name,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'upsideDown',
      title: 'Upside down variant',
      type: tarotCardVariant.name,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Card face',
      type: 'image',
      validation: (Rule) => Rule.required(),
    },
  ],
})

export const definitions = [tarotCardDescription, tarotCardVariant, tarotCard]

export const i18nFieldTypes = [tarotCardDescription.name, tarotCardVariant.name]
