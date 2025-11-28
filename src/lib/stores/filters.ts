import { queryStoreToRequestObject, type QueryObject } from '$utils/filters'
import { derived, writable } from 'svelte/store'

export type InfiniteQueryStore = {
  hasMore: boolean
  page: number
  search: string
  query?: QueryObject
}

function createInfiniteQueryStore() {
  const INITIAL_STATE = {
    hasMore: true,
    page: 0,
    search: '',
    query: undefined,
  }
  const { subscribe, update } = writable<InfiniteQueryStore>(INITIAL_STATE)

  function incrementPage() {
    update(state => ({
      ...state,
      page: state.page + 1,
    }))
  }

  function setSearch(search: string) {
    update(state => ({
      ...state,
      page: 0,
      hasMore: true,
      search,
    }))
  }

  function setQuery(query: QueryObject | undefined) {
    update(state => ({
      ...state,
      page: 0,
      hasMore: true,
      query,
    }))
  }

  function setFilters(search: string, query: QueryObject | undefined) {
    update(state => ({
      ...state,
      page: 0,
      hasMore: true,
      search,
      query,
    }))
  }

  function scrollEnd() {
    update(state => ({
      ...state,
      hasMore: false,
    }))
  }

  function reset(overrides: Partial<InfiniteQueryStore> = {}) {
    update(() => ({
      ...INITIAL_STATE,
      ...overrides,
    }))
  }

  return {
    subscribe,
    incrementPage,
    scrollEnd,
    setSearch,
    setQuery,
    setFilters,
    reset,
  }
}

export const infiniteQueryStore = createInfiniteQueryStore()
export const hasMore = derived(infiniteQueryStore, $infiniteQueryStore => $infiniteQueryStore.hasMore)
export const pageQuery = derived(infiniteQueryStore, $infiniteQueryStore =>
  queryStoreToRequestObject($infiniteQueryStore),
)
