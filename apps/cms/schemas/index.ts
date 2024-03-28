import * as layout from './layout'
import * as indexPage from './indexPage'
import * as tarotCardsSet from './tarotCardsSet'
import * as tarotReadingPage from './tarotReadingPage'
import * as manifestoPage from './manifestoPage'
import * as aboutUsPage from './aboutUsPage'

export const schemaTypes = [
  ...layout.definitions,
  ...indexPage.definitions,
  ...tarotCardsSet.definitions,
  ...tarotReadingPage.definitions,
  ...manifestoPage.definitions,
  ...aboutUsPage.definitions,
]
