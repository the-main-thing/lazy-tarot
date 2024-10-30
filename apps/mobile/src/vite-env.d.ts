/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_PUBLIC_API_KEY: string
	readonly VITE_PUBLIC_API_ENDPOINT: `https://${string}.${string}`
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
