export const KEYS = {
	singleCardReading: 'singleCardReading',
} as const

class InMemoryStorage {
	private storage = new Map<string, string>()
	setItem = (key: string, value: string) => {
		this.storage.set(key, value)
	}
	getItem = (key: string) => {
		return this.storage.get(key) || null
	}
	removeItem = (key: string) => {
		return this.storage.delete(key)
	}
}

const inMemoryStorage = new InMemoryStorage()

export class LocalStorage {
	private fallback: InMemoryStorage = inMemoryStorage
	private get storage() {
		try {
			if (typeof window !== 'undefined') {
				return window.localStorage
			}
			return this.fallback
		} catch {
			return this.fallback
		}
	}
	getItem = (key: string) => this.storage.getItem(key)
	setItem = (key: string, value: string) => this.storage.setItem(key, value)
	removeItem = (key: string) => this.storage.removeItem(key)
	constructor() {
		if (this.storage === this.fallback) {
			const interval = setInterval(() => {
				if (typeof window === 'undefined') {
					return
				}
				if (this.storage !== this.fallback) {
					clearInterval(interval)
				}
			}, 10)
		}
	}
}
