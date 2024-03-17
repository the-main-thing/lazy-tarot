import type {PluginConfig} from 'sanity-plugin-internationalized-array'

export const i18nConfig = {
  languages: [
    {id: 'ru', title: 'Russian'},
    {id: 'en', title: 'English'},
  ],
  defaultLanguages: ['ru'],
} as const satisfies Pick<PluginConfig, 'languages' | 'defaultLanguages'>
