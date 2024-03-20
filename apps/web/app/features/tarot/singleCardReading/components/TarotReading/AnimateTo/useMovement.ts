import { useState, useCallback, useMemo } from 'react'
import { useIsomorphicLayoutEffect, useSpring } from '@react-spring/web'

import { requestIdleCallback } from '@repo/utils'

import { trackPosition } from './trackPosition'
import { getStyle } from './getStyle'
import { fromElement, equals } from './position'

export const useAnimation = (target: Element | null) => {
	const [{ base, current, next }, setElements] = useState<{
		base: Element | null
		current: Element | null
		next: Element | null
	}>(() => ({ base: null, current: null, next: null }))

	const onNext = useCallback((element: Element | null) => {
		setElements((prevState) => {
			const { base, current, next } = prevState
			if (current === element) {
				return prevState
			}
			if (next === element) {
				return prevState
			}
			return { base, current, next: element }
		})
	}, [])

	const [basePosition, setBasePosition] = useState(() =>
		base ? fromElement(base) : null,
	)
	const setBase = useCallback((element: Element | null) => {
		setElements((elements) => ({ ...elements, base: element }))
		setBasePosition(element ? fromElement(element) : null)
	}, [])
	const targetElement = next || current
	const [targetPosition, setTargetPosition] = useState(() =>
		targetElement ? fromElement(targetElement) : null,
	)
	const state = useMemo(() => {
		if (!base) {
			return 'initial'
		}
		if (!current && !next) {
			return 'hidden'
		}
		if (current && !next) {
			return 'idle'
		}
		if (!current && next) {
			return 'teleporting'
		}
		if (current && next) {
			return 'moving'
		}

		throw new Error('Unexpected state')
	}, [base, current, next])

	const moving = state === 'moving'
	useIsomorphicLayoutEffect(() => {
		onNext(target)
		if (!moving) {
			return trackPosition(target, (position, element) => {
				onNext(element)
				setTargetPosition(position)
			})
		}
	}, [target, moving])

	useIsomorphicLayoutEffect(() => {
		if (!base || !targetElement) {
			return
		}
		const updatePosition = () => {
			setBasePosition((current) => {
				const next = fromElement(base)
				return !current || !equals(next, current) ? next : current
			})
			setTargetPosition((current) => {
				const next = fromElement(targetElement)
				return !current || !equals(next, current) ? next : current
			})
		}
		updatePosition()
		let cancelIdleCallback: ReturnType<typeof requestIdleCallback> | null =
			null
		const onResize = () => {
			cancelIdleCallback?.()
			cancelIdleCallback = requestIdleCallback(() => updatePosition())
		}
		window.addEventListener('resize', onResize)

		return () => {
			cancelIdleCallback?.()
			window.removeEventListener('resize', onResize)
		}
	}, [state, base, targetElement])

	const onAtPosition = useCallback((targetElement: Element | null) => {
		setElements((prevState) => {
			if (prevState.current === targetElement) {
				return prevState
			}
			if (prevState.next !== targetElement) {
				return prevState
			}
			return {
				base: prevState.base,
				current: targetElement,
				next: null,
			}
		})
		if (targetElement) {
			setTargetPosition((current) => {
				const next = fromElement(targetElement)
				return !current || !equals(next, current) ? next : current
			})
		}
	}, [])

	useIsomorphicLayoutEffect(() => {
		if (state === 'teleporting') {
			return onAtPosition(targetElement)
		}
	}, [state, onAtPosition, targetElement])

	const style = useMemo(() => {
		let hidden = false
		switch (state) {
			case 'initial':
			case 'hidden':
			case 'teleporting':
				hidden = true
				break
		}
		if (basePosition && targetPosition) {
			return {
				...getStyle({ from: basePosition, to: targetPosition }),
				opacity: hidden ? 0 : 1,
			}
		}
		return {
			translateX: '0px',
			translateY: '0px',
			scale: 1,
			opacity: 0,
		}
	}, [basePosition, targetPosition, state])

	const spring = useSpring({
		...style,
		onRest: () => onAtPosition(targetElement),
	})

	return [state === 'moving' ? spring : style, setBase] as const
}
