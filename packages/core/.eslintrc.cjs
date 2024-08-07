const { resolveTsConfig } = require('@repo/eslint-config/resolveTsConfig.cjs')
const project = resolveTsConfig(['apps', 'web'])

/**
 * This is intended to be a basic starting point for linting in your app.
 * It relies on recommended configs out of the box for simplicity, but you can
 * and should modify this configuration to best suit your team's needs.
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	globals: {
		React: true,
		JSX: true,
	},
	env: {
		browser: true,
		commonjs: true,
		es6: true,
	},

	settings: {
		'import/resolver': {
			typescript: {
				// project,
			},
		},
	},

	// Base config
	extends: ['eslint:recommended'],

	overrides: [
		// React
		{
			files: ['**/*.{js,jsx,ts,tsx}'],
			plugins: ['react', 'jsx-a11y'],
			extends: [
				'plugin:react/recommended',
				'plugin:react/jsx-runtime',
				'plugin:react-hooks/recommended',
				'plugin:jsx-a11y/recommended',
			],
			settings: {
				react: {
					version: 'detect',
				},
				formComponents: ['Form'],
				linkComponents: [
					{ name: 'Link', linkAttribute: 'to' },
					{ name: 'NavLink', linkAttribute: 'to' },
				],
				'import/resolver': {
					typescript: {
						// project,
					},
				},
			},
			rules: {
				'no-mixed-spaces-and-tabs': 'off',
				'react/prop-types': 'off',
				'no-case-declarations': 'off'
			},
		},

		// Typescript
		{
			files: ['**/*.{ts,tsx}'],
			plugins: ['@typescript-eslint', 'import'],
			parser: '@typescript-eslint/parser',
			settings: {
				'import/internal-regex': '^~/',
				'import/resolver': {
					node: {
						extensions: ['.ts', '.tsx'],
					},
					typescript: {
						alwaysTryTypes: true,
						project,
					},
				},
			},
			extends: [
				'plugin:@typescript-eslint/recommended',
				'plugin:import/recommended',
				'plugin:import/typescript',
			],
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-unused-vars': [
					'error',
					{
						args: 'all',
						argsIgnorePattern: '^_',
						caughtErrors: 'all',
						caughtErrorsIgnorePattern: '^_',
						destructuredArrayIgnorePattern: '^_',
						varsIgnorePattern: '^_',
						ignoreRestSiblings: true,
					},
				],
			},
		},

		// Node
		{
			files: ['.eslintrc.cjs'],
			env: {
				node: true,
			},
		},
	],
}
