import { writable } from 'svelte/store'

export const notificationsPanelActive = writable<boolean>(false)
export const spotlightActive = writable<boolean>(false)
export const footerNavbarActive = writable<boolean>(false)
export const assistantPanelActive = writable<boolean>(false)

/**
 * Loading store
 * @type {Writable<boolean>}
 * @description Store to manage a blocking loading state in the app. This will cause a loading overlay to appear on the screen.
 */
export const loading = writable<boolean>(false)
export const loadingMessage = writable<string | null>(null)

/**
 * Busy store
 * @type {Writable<boolean>}
 * @description Store to manage a non-blocking loading state in the app. It can be used to show local loading indicators.
 */
export const busy = writable<boolean>(false)

/**
 * App state stores
 * @type {Writable<boolean>}
 * @description These stores are used to handle the app screen size. They are updated on resize events.
 */
export const isMobile = writable<boolean>(false)
export const isTablet = writable<boolean>(false)

export function setLoading(value: boolean, message?: string) {
  loading.set(value)

  if (message) loadingMessage.set(message)
  if (!value) loadingMessage.set(null)
}

export function setBusy(value: boolean) {
  busy.set(value)
}

export async function busyUntil(fn: () => Promise<any>) {
  try {
    busy.set(true)
    return await fn()
  } catch (exception) {
    throw exception
  } finally {
    busy.set(false)
  }
}

export async function loadingUntil(fn: () => Promise<any>, message?: string) {
  try {
    setLoading(true, message)
    return await fn()
  } catch (exception) {
    throw exception
  } finally {
    setLoading(false)
  }
}
