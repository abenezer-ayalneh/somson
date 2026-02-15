import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [
		{
			name: 'mock-css-for-tests',
			enforce: 'pre',
			load(id) {
				if (id.endsWith('.css')) {
					return 'export default {}'
				}
				return null
			},
		},
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./', import.meta.url)),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.tsx'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
		},
	},
})
