import { ClientOnly } from 'remix-utils/client-only'
import classNames from 'classnames'

type Props = {
	revealed: boolean
	form: React.ReactNode
	description: React.ReactNode
	backPlaceholder: React.ReactNode
	facePlaceholder: React.ReactNode
	card: React.ReactNode
}

type ContentBlockProps = {
	children: React.ReactNode
	hidden: boolean
}

const hiddenClassName = 'opacity-0 pointer-events-none -z-50 absolute'

const Form = ({ children, hidden }: ContentBlockProps) => {
	return (
		<div
			aria-hidden={hidden ? 'true' : 'false'}
			className={classNames(
				'flex flex-col items-center gap-8',
				hidden ? hiddenClassName : '',
			)}
		>
			{children}
		</div>
	)
}

const Description = ({ children, hidden }: ContentBlockProps) => {
	return (
		<div
			aria-hidden={hidden ? 'true' : 'false'}
			className={classNames(
				'flex flex-col-reverse items-center landscape:flex-row landscape:flex-nowrap landscape:items-start gap-8',
				hidden ? hiddenClassName : '',
			)}
		>
			{children}
		</div>
	)
}

const FacePlaceholder = ({
	placeholder,
	card,
}: {
	placeholder: React.ReactNode
	card: React.ReactNode
}) => {
	return (
		<div
			aria-hidden="true"
			className="relative flex flex-col items-start"
		>
			{placeholder}
			<div className="absolute">{card}</div>
		</div>
	)
}

export const Layout = ({
	revealed,
	form,
	description,
	backPlaceholder,
	facePlaceholder,
	card,
}: Props) => {
	return (
		<ClientOnly
			fallback={
				<div className="flex flex-col items-center w-full">
					<Form hidden={revealed}>
						{form}
						<div className="flex flex-col items-center">
							{backPlaceholder}
							<div className="absolute">{card}</div>
						</div>
					</Form>
					<Description hidden={!revealed}>
						{description}
						<FacePlaceholder
							placeholder={facePlaceholder}
							card={card}
						/>
					</Description>
				</div>
			}
		>
			{() => (
				<div className="flex flex-col items-center w-full">
					<Form hidden={revealed}>
						{form}
						<div className="flex flex-col items-center">
							{backPlaceholder}
						</div>
					</Form>
					<Description hidden={!revealed}>
						{description}
						<FacePlaceholder
							placeholder={facePlaceholder}
							card={null}
						/>
					</Description>
					{card}
				</div>
			)}
		</ClientOnly>
	)
}
