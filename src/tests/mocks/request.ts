import { createRoute, type RouteOptions } from '$utils/routes'
import type { RequestEvent } from '@sveltejs/kit'

export function createRequestEvent(options: RouteOptions): RequestEvent {
  const routeURL = `http://arke.localhost.me${createRoute('/some/route', options)}`

  return {
    url: new URL(routeURL),
    params: {},
    locals: {
      userAccess: {
        isAdmin: true,
        modules: [],
        permissions: [],
      },
      token: '',
      language: '',
      scheme: 'light',
      isMobile: false,
      isApiKeyAuthenticated: true,
      maintenance: false,
      user: {
        exp: 0,
        full_name: '',
        iat: 0,
        roles: [],
        sub: '',
        super_admin: false,
        tenant: {
          tenant_id: '',
          tenant_url: '',
        },
        username: '',
      },
    },
    request: new Request('http://localhost/some/route'),
    route: {
      id: 'some/route',
    },
    platform: {},
    cookies: {
      get: () => undefined,
      getAll: () => [],
      serialize: () => '',
      set: () => {},
      delete: () => {},
    },
  } as unknown as RequestEvent
}
