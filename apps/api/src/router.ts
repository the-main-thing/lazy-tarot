import { router } from './trpc'

import { tarot } from './tarot'
import { pages } from './pages'
import { analytics } from './analytics'

export const appRouter = router({
  tarot,
  pages,
  analytics
})

export type AppRouter = typeof appRouter
