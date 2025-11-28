import '$root/src/i18n'
import { locale, waitLocale } from 'svelte-i18n'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async event => {
  if (event.data.language) locale.set(event.data.language)

  await waitLocale()
}
