import { requestIdleCallback } from '@repo/utils'
const LIST_SIZE = 90 * 3
const GENERATE_AT = Math.max(Math.floor(LIST_SIZE / 3) - 1, 1)
const randomValues = [] as Array<number>
let generating = false

const generate = () => {
	if (generating) {
		return
	}
	generating = true
	return requestIdleCallback(() => {
		for (let i = randomValues.length; i < 90 * 3; i++) {
			randomValues.push(Math.random())
		}
		generating = false
	})
}

generate()

export const rand = () => {
	if (randomValues.length === 0) {
		generate()
		return Math.random()
	}
	if (randomValues.length <= GENERATE_AT) {
		generate()
	}
	return randomValues.pop() as number
}
