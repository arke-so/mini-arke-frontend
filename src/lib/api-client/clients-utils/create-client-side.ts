import type { ConfigurationParameters } from '$api/iam'
import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { loginRoute } from '$utils/routes'

export function createGenericClientAuthenticationConfig(
  ConfigurationBuilder: any,
  defaults: Partial<ConfigurationParameters>,
  overrides: Partial<ConfigurationParameters> = {},
) {
  return new ConfigurationBuilder({
    ...defaults,
    middleware: [clientSideAuthenticationErrorMiddleware()],
    ...overrides,
  })
}

/**
 * Sends a cache request to the API proxy
 * @param seconds {number} - The amount of seconds to cache the response for
 * @returns {Partial<ConfigurationParameters>} - Configuration parameters with caching request headers
 */
export function createCachedClientConfiguration(seconds: number = 90): Partial<ConfigurationParameters> {
  return {
    headers: {
      'X-Client-Cached': `${seconds}`,
    },
  }
}

function clientSideAuthenticationErrorMiddleware() {
  return {
    post: async ({ response }: any) => {
      if (!response.ok && response.status === 401) {
        if (!browser) return

        return goto(loginRoute())
      }
    },
  }
}
