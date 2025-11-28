<script context="module" lang="ts">
  import { browser } from '$app/environment'
  import { PageMessageEvent, type PageMessageInterface } from '$fixtures/page-messages'
  import { randomUUID } from '$utils/string'
  import { onMount } from 'svelte'

  let selectedObserver: string | undefined = undefined

  export type SetObserverFunction = (proxy: WindowProxy | null) => void
  export type UnregisterFunction = () => void
  export type sendPageMessageOptions = {
    type?: string
    payload: unknown
  }

  type RegisterFunctionReturnType = {
    pageMessageId: string
    unregister: UnregisterFunction
    setObserver: SetObserverFunction
  }

  let api: {
    register?: (
      type: string,
      callback: (event: MessageEvent<PageMessageInterface>) => void,
    ) => RegisterFunctionReturnType
    unregister?: (type: string) => void
    sendPageMessageToOpener?(options: sendPageMessageOptions): void
  } = {}

  export function sendPageMessage(options: sendPageMessageOptions) {
    if (!browser) return
    if (!api.sendPageMessageToOpener) return

    api.sendPageMessageToOpener(options)
  }

  export function onPageMessage(
    type: string,
    callback: (event: MessageEvent<PageMessageInterface>) => void,
  ): RegisterFunctionReturnType {
    if (!browser || !api.register) throw new Error('onPageMessage can only be used in the browser environment')

    return api.register(type, callback)
  }

  export function unregisterPageMessage(type: string) {
    if (!browser) return
    if (!api.unregister) return

    api.unregister(type)
  }
</script>

<script lang="ts">
  let observers: Partial<Record<string, (event: MessageEvent) => void>> = {}

  function pageMessageCallback(messageEvent: MessageEvent<PageMessageInterface>) {
    if (!messageEvent.data.event || !messageEvent.data.type) return

    const { type, event } = messageEvent.data

    if (event === PageMessageEvent.SetObserver) {
      selectedObserver = type
    } else if (event === PageMessageEvent.Notify) {
      const observerId = selectedObserver || type
      observers[observerId]?.(messageEvent)
    }
  }

  function registerObserver(type: string, callback: (event: MessageEvent<PageMessageInterface>) => void) {
    const pageMessageId: string = `${type}-${randomUUID()}`
    const unregister = () => unregisterPageMessage(pageMessageId)
    const setObserver = (proxy: WindowProxy | null) => {
      if (!proxy) return

      setTimeout(() => {
        proxy.postMessage({
          event: PageMessageEvent.SetObserver,
          type: pageMessageId,
        })
      }, 1000)
    }

    observers[pageMessageId] = callback

    return {
      pageMessageId,
      unregister,
      setObserver,
    }
  }

  function unregisterObserver(type: string) {
    if (!browser) return

    delete observers[type]
  }

  function sendPageMessageToOpener(options: sendPageMessageOptions) {
    if (!browser) return
    if (!window.opener) return

    try {
      const type = selectedObserver || options.type
      const { payload } = options

      if (!type) return

      window.opener.postMessage({
        event: PageMessageEvent.Notify,
        type,
        payload,
      })
    } catch (error) {
      console.error('Could not send message to opener:', error)
    }
  }

  onMount(() => {
    api.register = registerObserver
    api.unregister = unregisterObserver
    api.sendPageMessageToOpener = sendPageMessageToOpener

    window.addEventListener('message', pageMessageCallback)

    return () => {
      if (!pageMessageCallback) return

      window.removeEventListener('message', pageMessageCallback)
    }
  })
</script>
