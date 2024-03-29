import { Link } from '@remix-run/react'
import { ClassNames } from '@emotion/react'

import { Typography } from './Typography'
import { useGetNavLink } from '~/utils/useGetNavLink'

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

export const NavigationBar = ({
	tarotReadingLinkTitle,
	manifestoLinkTitle,
}: {
	tarotReadingLinkTitle: string
	manifestoLinkTitle: string
}) => {
	return (
		<nav className="w-full">
			<ul className="w-full flex justify-between">
				<li>
					<NavLinkItem to={useGetNavLink({ hash: 'tarot-reading' })}>
						{tarotReadingLinkTitle}
					</NavLinkItem>
				</li>
				<li>
					<NavLinkItem to={useGetNavLink({ hash: 'manifesto' })}>
						{manifestoLinkTitle}
					</NavLinkItem>
				</li>
			</ul>
		</nav>
	)
}
