import { animated } from '@react-spring/web'

import { BodyBottomPortal } from '~/components'
import type { State } from '../useStateMachine'
import { useHideContentSpring } from './useHideContentSpring'

type Props = {
	state: State['value']
	onStart?: () => void
	onRest?: () => void
}

export const HideContent = (props: Props) => {
	const spring = useHideContentSpring(props)

	return (
		<BodyBottomPortal>
			<div className="absolute inset-0">
				<div className="absolute inset-0">
					<animated.div
						style={spring}
						className="fixed bg-white inset-0 w-full h-full min-w-screen min-h-screen pointer-events-none overflow-hidden"
					/>
				</div>
			</div>
		</BodyBottomPortal>
	)
}
