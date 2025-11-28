import {
  COLOR_SCHEME_COOKIE_NAME,
  COLOR_SCHEME_QUERY_PARAM,
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  LANGUAGE_QUERY_PARAM,
} from '$fixtures/constants';
import { adminRoute } from '$lib/utils/routes';
import { error } from '@sveltejs/kit';
import MobileDetect from 'mobile-detect';
import { locale } from 'svelte-i18n';

/** @type {import("@sveltejs/kit").Handle} */
export async function sessionDetails({ event, resolve }: { event: any; resolve: any }) {
  const languageCookie = event.cookies.get(LANGUAGE_COOKIE_NAME)
  const languageQuery = event.url.searchParams.get(LANGUAGE_QUERY_PARAM)
  const colorSchemeCookie = event.cookies.get(COLOR_SCHEME_COOKIE_NAME)
  const colorSchemeQuery = event.url.searchParams.get(COLOR_SCHEME_QUERY_PARAM)

  // Load the language from the query parameter or alternatively the cookie, if available
  event.locals.language = languageQuery || languageCookie || DEFAULT_LANGUAGE

  // Update the language cookie if the query parameter is available
  if (languageQuery && languageQuery !== languageCookie) {
    event.cookies.set(LANGUAGE_COOKIE_NAME, languageQuery, {
      httpOnly: true,
      path: '/',
      secure: false,
    })
  }

  // Load the color scheme from the query parameter or alternatively the cookie, if available
  event.locals.scheme = colorSchemeQuery || colorSchemeCookie || ''
  if (colorSchemeQuery && colorSchemeQuery !== colorSchemeCookie) {
    event.cookies.set(COLOR_SCHEME_COOKIE_NAME, colorSchemeQuery, {
      httpOnly: true,
      path: '/',
      secure: false,
    })
  }

  locale.set(event.locals.language)

  // If the user is not an admin, they should not be able to access admin routes
  if (!event?.locals?.user?.super_admin && event.url.pathname.startsWith(adminRoute())) throw error(404, { status: 404, message: 'Not found' })

  
  event.locals.isMobile = !!new MobileDetect(event.request.headers.get('user-agent')).mobile()

  return await resolve(event)
}
