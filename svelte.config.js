import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

function getVersion() {
	const { npm_package_version } = process.env

	return `v${npm_package_version}`
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),

		version: {
			name: getVersion(),
			// interval in milliseconds to poll for version changes
			pollInterval: 60_000,
		},

		alias: {
			$api: 'src/lib/api-client',
			$components: 'src/lib/components',
			$ds: 'src/lib/design-system',
			$flows: 'src/lib/flows',
			$fixtures: 'src/lib/fixtures',
			$stores: 'src/lib/stores',
			$utils: 'src/lib/utils',
			$locales: 'src/locales',
			$root: './',
		},
	},
};

export default config;
