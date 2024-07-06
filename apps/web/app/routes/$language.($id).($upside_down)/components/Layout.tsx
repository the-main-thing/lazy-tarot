import {
	createContext,
	useContext,
	useState,
	useEffect,
	useMemo,
	type Dispatch,
} from 'react'
import { NavigationBar, PortableText, Img } from '~/components'
import { Link } from '@remix-run/react'
import { TAROT_READING_SECTION_ID } from '../constants'
import { useRouteLoadersData } from '../RouteLoadersDataProvider'

type Props = {
	children: React.ReactNode
}

const Context = createContext<{
	blockScroll: [boolean, Dispatch<boolean>]
	scrollElement: HTMLDivElement | null
} | null>(null)
export const useLayoutContext = () => {
	const contextValue = useContext(Context)
	if (!contextValue) {
		throw new Error('useLayoutContext must be used within an Layout')
	}
	return contextValue
}
export const useBlockScroll = (block: boolean) => {
	const contextValue = useLayoutContext()
	const set = contextValue.blockScroll[1]
	useEffect(() => {
		set(block)
	}, [block, set])
}

export const Layout = ({ children }: Props) => {
	const {
		language,
		content: { rootLayoutContent, indexPageContent },
	} = useRouteLoadersData()
	const blockScroll = useState<boolean>(false)
	const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(
		null,
	)
	const contextValue = useMemo(() => {
		return {
			blockScroll,
			scrollElement,
		}
	}, [blockScroll, scrollElement])

	return (
		<div
			ref={setScrollElement}
			className={
				'w-full h-full' +
				(blockScroll[0] ? ' overflow-hidden' : ' overflow-y-auto')
			}
		>
			<div className="w-full md:w-11/12 p-4 pt-10 pb-20 md:pb-40 flex flex-col m-auto gap-16">
				<div id="index">
					<NavigationBar
						tarotReadingLinkTitle={
							rootLayoutContent.tarotReadingLinkTitle
						}
						manifestoLinkTitle={
							rootLayoutContent.manifestoLinkTitle
						}
					/>
				</div>
				<div className="w-full flex flex-col items-center mb-14 gap-4">
					<header>
						<Link
							to={`/${language}/#${TAROT_READING_SECTION_ID}`}
							className="pl-1 pr-1 md:pl-0 md:pr-0 md:w-8/12 m-auto text-center"
						>
							<PortableText
								value={indexPageContent.headerTitle}
							/>

							<div className="text-subheader site-header">
								<PortableText
									value={indexPageContent.headerDescription}
								/>
							</div>
						</Link>
					</header>
					<div className="relative -left-4">
						<div className="w-screen-30 landscape:w-screen-13 relative">
							<Img src={indexPageContent.logo} />
						</div>
					</div>
				</div>
				<Context.Provider value={contextValue}>
					{children}
				</Context.Provider>
			</div>
		</div>
	)
}
