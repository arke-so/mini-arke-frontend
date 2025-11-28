import { writable } from 'svelte/store'

function createWarningsStore() {
  const { subscribe, update } = writable<Record<string, any>>({})

  function setField(name: string, value: any) {
    update(state => ({
      ...state,
      [name]: value,
    }))
  }

  function clearField(name: string) {
    update(state => ({
      ...state,
      [name]: null,
    }))
  }

  function reset() {
    update(() => ({}))
  }

  return {
    subscribe,
    setField,
    clearField,
    reset,
  }
}

export const warningsStore = createWarningsStore()
