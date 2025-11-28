import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */

export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	},

	rules: {
		// 'import/order': [
		// 	'warn',
		// 	{
		// 		alphabetize: {
		// 			order: 'asc',
		// 			caseInsensitive: true,
		// 		},
		// 		'newlines-between': 'always',
		// 	},
		// ],
		'arrow-body-style': ['error', 'as-needed'],
		'arrow-spacing': ['error'],
		'block-spacing': ['error', 'always'],
		'comma-dangle': ['error', 'always-multiline'],
		'comma-spacing': ['error'],
		'key-spacing': ['warn'],
		'keyword-spacing': ['warn'],
		'no-alert': ['warn'],
		'no-console': ['warn'],
		'no-duplicate-imports': ['warn'],
		'no-empty-function': ['warn'],
		'no-eval': ['error'],
		'no-lonely-if': ['error'],
		'no-multiple-empty-lines': ['warn', { max: 2 }],
		'no-trailing-spaces': ['warn'],
		'no-unneeded-ternary': ['warn'],
		'no-unused-vars': [
			'error',
			{
				vars: 'all',
				args: 'after-used',
				ignoreRestSiblings: true,
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',

			},
		],
		eqeqeq: ['error', 'always'],
		'no-useless-computed-key': ['warn'],
		'no-var': ['error'],
		'no-whitespace-before-property': ['error'],
		'object-shorthand': ['warn'],
		'prefer-arrow-callback': ['warn'],
		'prefer-const': ['warn'],
		'prefer-destructuring': ['warn'],
		'prefer-spread': ['warn'],
		'rest-spread-spacing': ['error', 'never'],
		'quote-props': ['warn', 'as-needed'],
		quotes: ['warn', 'single', { avoidEscape: true }],
		'require-atomic-updates': ['warn'],
		semi: ['error', 'never', { beforeStatementContinuationChars: 'always' }],
		'space-before-blocks': ['error'],
		'space-before-function-paren': ['off', 'always'],
		'space-infix-ops': ['error'],
		'spaced-comment': ['warn', 'always'],
		'switch-colon-spacing': ['warn'],
		'svelte/no-at-html-tags': ['off', 'always'],
	},
];
