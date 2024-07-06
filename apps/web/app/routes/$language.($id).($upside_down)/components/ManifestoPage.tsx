import { memo } from 'react'
import { PortableText, Img } from '~/components'
import type { LoaderData } from '../loader.server'

export const ManifestoPage = memo(
	({
		content: manifestoPageContent,
		hide,
	}: {
		content: LoaderData['content']['manifestoPageContent']
		hide: boolean
	}) => {
		const { headerImage, header, content } = manifestoPageContent
		return (
			<section
				id="manifesto"
				className={
					'transition-opacity duration-300 ' + (hide ? 'opacity-0 ' : 'opacity-100')
				}
			>
				<article className="flex flex-col gap-16 w-full landscape:flex-row landscape:flex-nowrap">
					<div className="flex flex-col-reverse portrait:flex-col items-center gap-16">
						<div className="landscape:w-screen-33 portrait:w-screen-70">
							<Img src={headerImage} alt="" aria-hidden="true" />
						</div>
						<div className="text-pretty uppercase">
							<PortableText value={header} />
						</div>
					</div>
					<div className="flex flex-col items-end gap-4">
						<div className="text-pretty text-justify hyphens-auto flex flex-col gap-4">
							<PortableText value={content} />
						</div>
					</div>
				</article>
			</section>
		)
	},
)

ManifestoPage.displayName = 'ManifestoPage'
