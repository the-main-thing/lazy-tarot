import { randInt } from './randInt.js'

it('should generate 0, 1 and 2 at least once', () => {
	let zero = null as null | number
	let one = null as null | number
	let two = null as null | number
	let somethingElse = null as null | number
	while (zero === null || one === null) {
		const int = randInt(0, 2)
		if (int === 0) {
			zero = int
			continue
		}
		if (int === 1) {
			one = int
			continue
		}
		if (int === 2) {
			two = int
			continue
		}
		somethingElse = int
	}

	expect(zero).toBe(0)
	expect(one).toBe(1)
	expect(two).toBe(2)
	expect(somethingElse).toBe(null)
})
