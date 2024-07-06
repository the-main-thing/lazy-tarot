import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

installGlobals()

export default defineConfig({
	plugins: [
		remix({
			ignoredRouteFiles: ['**/*.css', '**/*.module.*'],
		}),
		tsconfigPaths(),
	],
	define: {
		__API_KEY__: JSON.stringify(crypto.randomUUID()),
		__BUILD_TIMESTAMP__: JSON.stringify(Math.floor(Date.now() / 1000)),
	},
})
