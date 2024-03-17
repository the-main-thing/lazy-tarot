import {defineType} from 'sanity'

const indexPage = defineType({
  name: 'indexPage',
  type: 'document',
  title: 'Index page content',
  preview: {
    select: {
      title: 'title',
    },
    prepare(_) {
      return {
        title: 'Index page',
      }
    },
  },
  fields: [
    {
      name: 'title',
      title: 'Page title (SEO)',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Page description (SEO)',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'headerTitle',
      title: 'Page header title',
      type: 'internationalizedArrayFormattedText',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'headerDescription',
      title: 'Page header description',
      type: 'internationalizedArrayFormattedText',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      validation: (Rule) => Rule.required(),
    },
  ],
})

export const definitions = [indexPage]
