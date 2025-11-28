import { clients } from '$api/api-client.client'
import { Configuration, type ConfigurationParameters } from '$api/freeform'

/**
 * Create an API configuration object (client-side)
 * @param [overrides] - Configuration overrides (optional)
 * @returns {Configuration} - The client-side API configuration object
 */
export function createClientApiConfig(overrides: Partial<ConfigurationParameters> = {}) {
  return new Configuration({
    basePath: clients.freeform.internalPath,
    ...overrides,
  })
}
