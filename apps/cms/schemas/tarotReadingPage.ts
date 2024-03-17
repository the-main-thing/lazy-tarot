import {defineType} from 'sanity'

const tarotReadingPage = defineType({
  name: 'tarotReadingPage',
  type: 'document',
  title: 'Tarot reading page content',
  preview: {
    select: {
      title: 'title',
    },
    prepare(_) {
      return {
        title: 'Tarot reading page',
      }
    },
  },
  fields: [
    {
      name: 'headerTitle',
      title: 'Form header title',
      type: 'internationalizedArrayFormattedText',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'formDescription',
      title: 'New tarot of the day form description',
      type: 'internationalizedArrayFormattedText',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'submitButtonLabel',
      title:
        'Submit button label. This is visible only for screen readers (users with vision disabilities).',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'cardBackImage',
      title: 'Card back image',
      type: 'image',
      validation: (Rule) => Rule.required(),
    },
  ],
})

export const definitions = [tarotReadingPage]
