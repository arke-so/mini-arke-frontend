import { Configuration, type ConfigurationParameters } from '$api/analytics'
import { ApiClientID, getConfiguration } from '$api/api-client.server'
import { createGenericAuthenticationConfig } from '$api/clients-utils/create-client'
import type { RequestEvent } from '@sveltejs/kit'

const configuration = getConfiguration()
const clientConfig = configuration.clients[ApiClientID.Analytics]
const CONFIG_DEFAULTS: ConfigurationParameters = {
  basePath: clientConfig.serviceBaseURL,
}

/**
 * Create an authentication configuration object (server-side)
 * @param event - The SvelteKit page load event
 * @param [overrides] - Configuration overrides (optional)
 * @returns {Configuration} - The authentication configuration object
 */
export function createAuthenticationConfig(event: RequestEvent, overrides: Partial<ConfigurationParameters> = {}) {
  return createGenericAuthenticationConfig(Configuration, event, CONFIG_DEFAULTS, overrides)
}
