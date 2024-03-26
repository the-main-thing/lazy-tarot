import {defineType} from 'sanity'

const rootLayout = defineType({
  name: 'rootLayout',
  title: 'Root layout',
  description: 'The root layout. All of the pages will be rendered in this layout.',
  type: 'document',
  validation: (Rule) => Rule.required(),
  preview: {
    select: {
      title: 'title',
    },
    prepare(_) {
      return {
        title: 'Root layout',
      }
    },
  },
  fields: [
    {
      name: 'manifestoLinkTitle',
      title: 'Manifesto link title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'tarotReadingLinkTitle',
      title: 'Tarot reading link title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'ogData',
      title: 'Open graph data (SEO)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'meta',
          title: 'Meta',
          fields: [
            {
              type: 'string',
              name: 'property',
              title: 'property',
              validation: (Rule) => Rule.required(),
            },
            {
              type: 'internationalizedArrayString',
              name: 'content',
              title: 'content',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    },
  ],
})

export const definitions = [rootLayout]
