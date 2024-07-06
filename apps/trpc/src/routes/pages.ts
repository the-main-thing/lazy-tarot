import { z } from 'zod'
import { pages } from '@repo/api'
import { publicProcedure } from '../trpc'
import { BREAKPOINTS } from '@repo/core'

export const getAllPagesData = publicProcedure
	.input(
		z.object({
			language: z.string().optional(),
		}),
	)
	.query(async ({ input, ctx: context }) => {
		return pages.getPages({
			breakpoints: BREAKPOINTS,
			language: input.language,
			context,
		})
	})
