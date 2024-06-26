import { ClassNames } from '@emotion/react'
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
		<section
			id="about-us"
			className="flex flex-col w-full gap-16 overflow-x-hidden"
		>
			<article className="flex flex-col gap-16 w-full landscape:flex-row landscape:flex-nowrap landscape:justify-between">
				<div className="flex flex-col gap-4 landscape:pt-8">
					<div className="text-pretty">
						<Typography variant="h5" className="italic">
							{header.teamTitle}
						</Typography>
					</div>
					<div className="text-pretty uppercase">
						<Typography variant="h2">{header.pageTitle}</Typography>
					</div>
				</div>
				<div className="flex flex-col items-end w-full gap-4">
					<ClassNames>
						{({ cx, css }) => (
							<div
								className={cx(
									'landscape:w-screen-25 rounded portrait:w-screen-70',
									css`
										@media (orientation: landscape) {
											margin-right: 5.9rem;
										}
									`,
								)}
							>
								<Img
									src={image}
									alt=""
									aria-hidden="true"
									className="rounded"
								/>
							</div>
						)}
					</ClassNames>
				</div>
			</article>
			{social.length ? (
				<ul className="flex flex-col md:flex-row md:flex-nowrap gap-4 justify-center">
					{social.map(({ title, urlTitle, url }) => (
						<li
							key={title + urlTitle + url}
							className="flex flex-1 flex-col gap-4 pb-4 border-b border-black"
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
				</ul>
			) : null}
		</section>
	)
}
