import { clients } from '$api/api-client.client'
import { createGenericClientAuthenticationConfig } from '$api/clients-utils/create-client-side'
import { Configuration, type ConfigurationParameters } from '$api/product'

const CONFIG_DEFAULTS: ConfigurationParameters = {
  basePath: clients.product.internalPath,
}

/**
 * Create an API configuration object (client-side)
 * @param [overrides] - Configuration overrides (optional)
 * @returns {Configuration} - The client-side API configuration object
 */
export function createClientApiConfig(overrides: Partial<ConfigurationParameters> = {}): Configuration {
  return createGenericClientAuthenticationConfig(Configuration, CONFIG_DEFAULTS, overrides)
}
