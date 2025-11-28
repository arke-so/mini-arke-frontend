import { browser } from '$app/environment'

/**
 * Check if the current platform is a Mac
 * @returns {boolean} - whether the current platform is a Mac
 */
export function isMac() {
  if (!browser) return true

  return window.navigator.platform.toLowerCase().includes('mac')
}
