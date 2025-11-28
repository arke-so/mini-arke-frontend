import { appRootRoute } from '$utils/routes'
import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  redirect(302, appRootRoute())
}
