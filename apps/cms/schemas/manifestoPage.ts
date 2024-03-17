import {defineType} from 'sanity'

const manifestoPage = defineType({
  name: 'manifestoPage',
  type: 'document',
  title: 'Manifesto',
  preview: {
    select: {
      title: 'title',
    },
    prepare(_) {
      return {
        title: 'Manifesto',
      }
    },
  },
  description: 'Content of the Manifesto page',
  fields: [
    {
      name: 'header',
      title: 'Header',
      type: 'internationalizedArrayFormattedText',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'internationalizedArrayFormattedText',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'headerImage',
      title: 'Header image',
      type: 'image',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'contentImage',
      title: 'Content image',
      type: 'image',
      validation: (Rule) => Rule.required(),
    },
  ],
})

export const definitions = [manifestoPage]
