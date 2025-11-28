import { page } from '$app/stores'
import { get } from 'svelte/store'

export function isMobileDevice() {
  return get(page).data.isMobile || false
}
