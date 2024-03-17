import {defineConfig, isDev, defineField} from 'sanity'
import {visionTool} from '@sanity/vision'
import {structureTool} from 'sanity/structure'

import {schemaTypes} from './schemas'
import {getStartedPlugin} from './plugins/sanity-plugin-tutorial'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {i18nConfig} from './i18nConfig'

const devOnlyPlugins = [getStartedPlugin()]

const {projectId, dataset} = {
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: 'production',
}

export default defineConfig({
  name: 'default',
  title: 'guess',

  projectId,
  dataset,

  plugins: [
    structureTool(),
    visionTool(),
    internationalizedArray({
      ...i18nConfig,
      fieldTypes: [
        'string',
        defineField({
          name: 'formattedText',
          type: 'array' as const,
          of: [
            {
              type: 'block',
              styles: [
                {title: 'Normal', value: 'normal'},
                {title: 'Italic', value: 'italic'},
                {title: 'Bold', value: 'bold'},
                {title: 'H1', value: 'h1'},
                {title: 'H2', value: 'h2'},
                {title: 'H3', value: 'h3'},
                {title: 'H4', value: 'h4'},
                {title: 'H5', value: 'h5'},
                {title: 'H6', value: 'h6'},
              ],
            },
          ],
        }),
      ],
    }),
    ...(isDev ? devOnlyPlugins : []),
  ],

  schema: {
    types: schemaTypes,
  },
})
