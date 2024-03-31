import {defineType} from 'sanity'

const aboutUsPage = defineType({
  name: 'aboutUsPage',
  type: 'document',
  title: 'About us',
  preview: {
    select: {
      title: 'title',
    },
    prepare(_) {
      return {
        title: 'About us',
      }
    },
  },
  description: 'Content of the about us page',
  fields: [
    {
      name: 'header',
      title: 'Header',
      type: 'object',
      fields: [
        {
          name: 'teamTitle',
          title: 'Team title',
          description: '"Lazy tarot" on the wireframe',
          type: 'internationalizedArrayString',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'pageTitle',
          title: 'Page title',
          description: '"OUR TEAM" on the wireframe',
          type: 'internationalizedArrayString',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'article',
      title: 'About us article',
      type: 'internationalizedArrayFormattedText',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'social',
      title: 'Social links',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Social link',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'urlTitle',
              title: 'URL title',
              description: 'Text that will be displayed instead of the actual url',
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    },
  ],
})

export const definitions = [aboutUsPage]
