import { forwardRef } from 'react'
import { ClassNames } from '@emotion/react'

import { Card } from '~/components/Card'
import type { ImgProps } from '~/components/Img'

// import { FORM_ID } from './constants'
import {
	stateToCardState,
	// hiddenState
} from './useRevealState'
import type { Send, RevealState } from './useRevealState'

type Props = {
	send: Send
	state: RevealState['value']
	face: ImgProps['src']
	back: ImgProps['src']
	upsideDown: boolean
	buttonLabel?: string
}

const Container = forwardRef<
	HTMLDivElement | HTMLButtonElement,
	{
		children: React.ReactNode
		state: RevealState['value']
		buttonLabel?: string
		className?: string
		___DELETE_ME: Send
	}
>(({ children, buttonLabel, className, state, ___DELETE_ME }, ref) => {
	if (!buttonLabel) {
		return (
			<div
				ref={ref as never}
				aria-hidden={true}
				className={
					'opacity-0 relative -z-50 pointer-events-none ' + className
				}
			>
				{children}
			</div>
		)
	}

	// if (!hiddenState[state]) {
	// 	return (
	// 		<div
	// 			ref={ref as never}
	// 			aria-hidden="true"
	// 			className={'relative ' + className}
	// 		>
	// 			{children}
	// 		</div>
	// 	)
	// }

	return (
		<button
			ref={ref as never}
			// type="submit"
			// form={FORM_ID}
			onClick={() => ___DELETE_ME({ type: 'TOGGLE' })}
			className={'block relative ' + className}
		>
			<div className="sr-only">{buttonLabel}</div>
			{children}
		</button>
	)
})

Container.displayName = 'Container'

const CardOfTheDay = forwardRef<HTMLDivElement, Props>(
	({ send, state, face, back, upsideDown, buttonLabel }, ref) => {
		return (
			<Container
				buttonLabel={buttonLabel}
				className="inline-flex flex-col items-center"
				state={state}
				___DELETE_ME={send}
			>
				<ClassNames>
					{({ css }) => (
						<Card
							ref={ref}
							face={face}
							back={back}
							state={stateToCardState[state]}
							imgProps={{
								className: css`
									@media (orientation: landscape) {
										max-width: 20vw;
										max-height: 90vh;
									}
									@media (orientation: portrait) {
										max-width: 90vw;
										max-height: 40vh;
									}
								`,
							}}
							upsideDown={upsideDown}
							onAnimationComplete={() => {
								send({
									type: 'COMPLETED',
								})
							}}
						/>
					)}
				</ClassNames>
			</Container>
		)
	},
)

CardOfTheDay.displayName = 'CardOfTheDay'

export { CardOfTheDay as Card }
