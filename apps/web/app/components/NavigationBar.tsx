import { Link, useSearchParams } from '@remix-run/react'
import { ClassNames } from '@emotion/react'

import { Typography } from './Typography'

const NavLinkItem = ({
	to,
	children,
}: {
	to: string
	children: React.ReactNode
}) => (
	<ClassNames>
		{({ cx, css }) => (
			<Link
				to={to}
				className={cx(
					'italic border-transparent border-b-2 hover:border-black focus:border-black pb-1',
					css`
						transition: border-bottom 0.2s ease-in-out;
					`,
				)}
			>
				<Typography variant="span">{children}</Typography>
			</Link>
		)}
	</ClassNames>
)

const getLink = (hash: string, searchParams: URLSearchParams) => {
	let search = searchParams.toString()
	if (search) {
		search = `?${search}`
	}

	return `/${search}#${hash}`
}

export const NavigationBar = ({
	tarotReadingLinkTitle,
	manifestoLinkTitle,
}: {
	tarotReadingLinkTitle: string
	manifestoLinkTitle: string
}) => {
	const [searchParams] = useSearchParams()
	return (
		<nav className="w-full">
			<ul className="w-full flex justify-between">
				<li>
					<NavLinkItem to={getLink('tarot-reading', searchParams)}>
						{tarotReadingLinkTitle}
					</NavLinkItem>
				</li>
				<li>
					<NavLinkItem to={getLink('manifesto', searchParams)}>
						{manifestoLinkTitle}
					</NavLinkItem>
				</li>
			</ul>
		</nav>
	)
}
