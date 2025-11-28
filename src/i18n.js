import { init, register } from 'svelte-i18n'

const DEFAULT_LANGUAGE = 'it-IT'

register('en-US', () => import('./locales/en-US.json'))
register('it-IT', () => import('./locales/it-IT.json'))

init({
  fallbackLocale: DEFAULT_LANGUAGE,
  initialLocale: DEFAULT_LANGUAGE,
})