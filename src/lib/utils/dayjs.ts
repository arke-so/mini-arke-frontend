import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/it'
import { locale } from 'svelte-i18n'
import { get } from 'svelte/store'

/**
 * sets dayjs locale based on the current app locale
 */
export function syncDayjsLocale(): void {
  const currentLocale = get(locale)
  if (currentLocale) {
    const dayjsLocale = currentLocale.startsWith('it') ? 'it' : 'en'
    dayjs.locale(dayjsLocale)
  }
}

export { dayjs }
