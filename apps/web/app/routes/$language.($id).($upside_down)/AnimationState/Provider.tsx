import { createContext, useContext, useEffect } from 'react'

import { useAnimationState as useAnimationStateReducer } from './useAnimationState'
import type { ActionData } from '../clientAction'
import { useRouteLoadersData } from '../RouteLoadersDataProvider'

type ContextType = ReturnType<typeof useAnimationStateReducer>
const Context = createContext<ContextType | null>(null)
export const useAnimationState = () => {
	const context = useContext(Context)
	if (!context) {
		throw new Error(
			'useAnimationState must be used within an AnimationStateProvider',
		)
	}
	return context
}

export const AnimationStateProvider = ({
	children,
	actionData,
}: {
	children: React.ReactNode
	actionData: ActionData | undefined
}) => {
	const loaderData = useRouteLoadersData()
	const contextValue = useAnimationStateReducer([loaderData, actionData])
	const send = contextValue[1]
	const revealed = loaderData.revealed
	useEffect(() => {
		send({ type: revealed ? 'REVEAL' : 'HIDE' })
	}, [send, revealed])
	return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
