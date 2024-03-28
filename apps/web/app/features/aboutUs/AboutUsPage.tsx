import { type ImgProps, Img, Typography } from '~/components'

type Props = {
	header: {
		teamTitle: string
		pageTitle: string
	}
	image: ImgProps['src']
	social: Array<{
		title: string
		urlTitle: string
		url: string
	}>
}

export const AboutUsPage = ({ header, image, social }: Props) => {
	return (
		<section id="about-us" className="flex flex-col w-full gap-16">
			<article className="flex flex-col gap-16 w-full landscape:flex-row landscape:flex-nowrap landscape:justify-between">
				<div className="flex flex-col gap-4 landscape:pt-8">
					<div className="text-pretty">
						<Typography variant="h5" className="italic">
							{header.teamTitle}
						</Typography>
					</div>
					<div className="text-pretty uppercase">
						<Typography variant="h3">{header.pageTitle}</Typography>
					</div>
				</div>
				<div className="flex flex-col items-end gap-4">
					<div className="landscape:w-screen-20 rounded portrait:w-screen-70">
						<Img
							src={image}
							alt=""
							aria-hidden="true"
							className="rounded"
						/>
					</div>
				</div>
			</article>
			{social.length ? (
				<ul className="flex flex-row flex-nowrap gap-4 justify-center">
					{social.map(({ title, urlTitle, url }) => (
						<li
							key={title + urlTitle + url}
							className="flex flex-1 flex-col gap-4 pb-4 border-b"
						>
							<Typography variant="default">{title}</Typography>
							<a className="flex flex-col gap-4" href={url}>
								<Typography
									variant="default"
									className="italic"
								>
									{urlTitle}
								</Typography>
							</a>
						</li>
					))}
					<li className="flex flex-1 flex-col gap-4 pb-4 border-b">
						<Typography variant="default">Email</Typography>
						<a
							className="flex flex-col gap-4"
							href="mailto:mail@example.com"
						>
							<Typography variant="default" className="italic">
								@lazytarot
							</Typography>
						</a>
					</li>
				</ul>
			) : null}
		</section>
	)
}
