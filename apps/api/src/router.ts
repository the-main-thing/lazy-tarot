import { router } from './trpc'

import { tarot } from './tarot'
import { pages } from './pages'

export const appRouter = router({
  tarot,
  pages,
})

export type AppRouter = typeof appRouter
