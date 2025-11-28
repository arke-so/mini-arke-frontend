import type { ConfigurationParameters } from '$api/iam'
import { loginRoute } from '$utils/routes'
import { redirect, type RequestEvent } from '@sveltejs/kit'

export function createGenericAuthenticationConfig(
  ConfigurationBuilder: any,
  event: RequestEvent,
  defaults: Partial<ConfigurationParameters>,
  overrides: Partial<ConfigurationParameters> = {},
) {
  const ipAddress = event?.request?.headers?.get('x-forwarded-for') || event.getClientAddress()
  const host = event?.request?.headers?.get('host')
  const additionalHeaders = {
    'X-Forwarded-For': ipAddress,
    'X-Forwarded-Host': host,
  }

  return new ConfigurationBuilder({
    ...defaults,
    ...{
      headers: {
        Authorization: `Bearer ${event.locals.token}`,
        ...additionalHeaders,
        ...(overrides?.headers || {}),
      },
      middleware: [authenticationErrorMiddleware()],
      ...overrides,
    },
  })
}

function authenticationErrorMiddleware() {
  return {
    post: async ({ response }: any) => {
      if (!response.ok && response.status === 401) {
        return redirect(302, loginRoute())
      }
    },
  }
}
