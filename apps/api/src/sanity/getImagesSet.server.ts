import { parseNumber } from '@repo/utils/parseNumber'

import { urlFor } from './urlFor.server'
import type { schemas } from './schemas.server'
import type { SanityClient } from './client.server'

// https://cdn.sanity.io/images/<project id>/<dataset name>/<asset name>-<original width>x<original height>.<original file format>
const getDimentions = (src: string) => {
  const url = new URL(src)
  const info = url.pathname.split('/').filter(Boolean)[3]
  if (!info) {
    return null
  }

  // <asset name>-<original width>x<original height>.<original file format>
  const dimentions = (
    info.split('-')[1]?.split('.')[0]?.split('x') || [NaN, NaN]
  ).map((value) => parseNumber(value, null))

  if (!dimentions[0] || !dimentions[1] || dimentions.length !== 2) {
    return null
  }

  return dimentions as [width: number, height: number]
}

export const getImagesSet = async <
  TBreakpoints extends Record<number, number>,
>({
  client,
  image,
  breakpoints,
  format,
}: {
  client: SanityClient
  format?: 'png' | 'jpg'
  breakpoints: TBreakpoints
  image: ReturnType<(typeof schemas)['image']['parse']>
}) => {
  let dimentions = null as null | [width: number, height: number]
  const entries = await Promise.all(
    Object.entries(breakpoints).map(async ([breakPoint, width]) => {
      let src = urlFor(client, image)
        .width(width)
        .fit('clip')
        .format(format || 'jpg')
        .quality(breakPoint === 'placeholder' ? 30 : 90)
        .url()

      if (dimentions === null) {
        dimentions = getDimentions(src)
      }

      return [
        breakPoint,
        {
          src,
          width,
          originalDimentions: dimentions,
        },
      ]
    }),
  )
  return Object.fromEntries(entries) as {
    [key in keyof TBreakpoints]: {
      src: string
      width: TBreakpoints[key]
      originalDimentions: [width: number, height: number]
    }
  }
}
