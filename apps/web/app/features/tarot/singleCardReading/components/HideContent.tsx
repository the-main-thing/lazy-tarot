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
			<div className="absolute top-0 left-0">
				<animated.div
					style={spring}
					className="fixed bg-white w-screen h-screen top-0 left-0 pointer-events-none overflow-hidden"
				/>
			</div>
		</BodyBottomPortal>
	)
}
