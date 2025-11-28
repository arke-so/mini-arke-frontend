import { browser } from '$app/environment'
import { page } from '$app/stores'
import { derived, get, writable } from 'svelte/store'

const RETURN_URL_KEY = 'returnURL'

function createHistoryStore() {
  const INITIAL_STATE: Array<string> = []
  const { subscribe, update } = writable(INITIAL_STATE)

  function addEntry(nextPath: string | undefined) {
    if (!nextPath) return

    update(state => {
      if (state[state.length - 1] === nextPath) return state

      const nextState = [...state, nextPath]
      if (nextState.length >= 10) return nextState.slice(1)

      return [...state, nextPath]
    })
  }

  return {
    subscribe,
    addEntry,
  }
}

function createReturnURLStore() {
  const INITIAL_STATE: string | null = browser ? sessionStorage.getItem(RETURN_URL_KEY) : null
  const { subscribe, set } = writable(INITIAL_STATE)

  function updateFromURL(url?: URL) {
    if (!url) return
    const urlParam = url.searchParams.get(RETURN_URL_KEY)

    if (urlParam) {
      set(urlParam)
      if (browser) sessionStorage.setItem(RETURN_URL_KEY, urlParam)
    }
  }

  function setURL(url: string | null) {
    set(url)
    if (browser) {
      if (url) sessionStorage.setItem(RETURN_URL_KEY, url)
      else sessionStorage.removeItem(RETURN_URL_KEY)
    }
  }

  function clear() {
    set(null)
    if (browser) {
      sessionStorage.removeItem(RETURN_URL_KEY)
    }
  }

  return {
    subscribe,
    updateFromURL,
    set: setURL,
    clear,
  }
}

export const historyStore = createHistoryStore()
export const returnURLStore = createReturnURLStore()

export const previousPage = derived(historyStore, $historyStore => $historyStore[$historyStore.length - 2])
export const shouldUseReferrer = derived(page, $page => $page.url.searchParams.has('ref'))
export const routeParams = derived([shouldUseReferrer, page], 
  ([$shouldUseReferrer, $page]) => {
    const params: Record<string, any> = {}
    const tab = $page.url.searchParams.get('tab')

    if ($shouldUseReferrer) params.useReferrer = true
    if (tab) params.tab = tab

    return params
  }
)

export function getProperReferrer({ fallback }: { fallback: string }): string {
  return get(shouldUseReferrer) ? get(previousPage) : fallback
}
