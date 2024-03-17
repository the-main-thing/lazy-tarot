import { NavLink } from '@remix-run/react'
import { ClassNames } from '@emotion/react'

const NavLinkItem = ({
	to,
	children,
}: {
	to: string
	children: React.ReactNode
}) => (
	<ClassNames>
		{({ cx, css }) => (
			<NavLink
				to={to}
				className={cx(
					'italic text-xl md:text-2xl lg:text-3xl border-transparent border-b-2 hover:border-black focus:border-black pb-1',
					css`
						transition: border-bottom 0.2s ease-in-out;
					`,
				)}
			>
				{children}
			</NavLink>
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
					<NavLinkItem to="/#tarot-reading">
						{tarotReadingLinkTitle}
					</NavLinkItem>
				</li>
				<li>
					<NavLinkItem to="/#manifesto">
						{manifestoLinkTitle}
					</NavLinkItem>
				</li>
			</ul>
		</nav>
	)
}
