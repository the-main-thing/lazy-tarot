/**
 * @param min number minimum value (inclusive)
 * @param max number maximum value (inclusive)
 */
export const randInt = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min
}
