import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { SanityClient } from './client.server'

export const urlFor = (client: SanityClient, source: SanityImageSource) => {
  return imageUrlBuilder(client).image(source)
}
