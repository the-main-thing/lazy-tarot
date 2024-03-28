import {
	PortableText,
	type PortableTextValue,
	type ImgProps,
	Img,
} from '~/components'

type Props = {
	header: PortableTextValue
	content: PortableTextValue
	headerImage: ImgProps['src']
	contentImage: ImgProps['src']
}

export const ManifestoPage = ({
	header,
	content,
	headerImage,
	contentImage,
}: Props) => {
	return (
		<section id="manifesto">
			<article className="flex flex-col gap-16 w-full landscape:flex-row landscape:flex-nowrap">
				<div className="flex flex-col items-center gap-16">
					<div className="landscape:w-screen-33 portrait:w-screen-70">
						<Img src={headerImage} alt="" aria-hidden="true" />
					</div>
					<div className="text-pretty uppercase">
						<PortableText value={header} />
					</div>
				</div>
				<div className="flex flex-col items-end gap-4">
					<div className="text-pretty text-justify hyphens-auto">
						<PortableText value={content} />
					</div>
					<div className="landscape:w-screen-14 rounded portrait:w-screen-70">
						<Img src={contentImage} alt="" aria-hidden="true" className="rounded" />
					</div>
				</div>
			</article>
		</section>
	)
}
