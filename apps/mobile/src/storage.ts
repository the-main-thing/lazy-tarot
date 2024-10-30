import { Storage } from '@ionic/storage'
const store = new Storage()

const storePromise = store.create()
export const storage = {
	getItem: async (key: string) => {
		try {
			const store = await storePromise
			return [store.get(key), null] as const
		} catch (error) {
			return [null, error] as const
		}
	},
	setItem: async (key: string, value: string) => {
		try {
			const store = await storePromise
			await store.set(key, value)
			return [null, null] as const
		} catch (error) {
			return [null, error] as const
		}
	},
	removeItem: async (key: string) => {
		try {
			const store = await storePromise
			await store.remove(key)
			return [null, null] as const
		} catch (error) {
			return [null, error] as const
		}
	},
}
