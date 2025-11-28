<script lang="ts">
  import { afterNavigate } from '$app/navigation'
  import { navigating } from '$app/stores'
  import { IcoNoir } from '$ds/components/icons/iconoir'
  import { Toaster } from '$ds/components/ui/sonner'
  import { footerNavbarActive, loading, loadingMessage } from '$stores/app'
  import { historyStore, returnURLStore } from '$stores/history'
  import '@fontsource-variable/inter'
  import { _ } from 'svelte-i18n'
  import { scale } from 'svelte/transition'
  import '../app.css'

  let isLoading: boolean = false
  let loadingTimeout: NodeJS.Timeout | null = null
  let innerWidth: number = 0
  let innerHeight: number = 0

  function throttleLoading(bool: boolean) {
    if (bool === false) {
      isLoading = false
      if (loadingTimeout) clearTimeout(loadingTimeout)
      return
    }

    if (isLoading) return
    if (loadingTimeout) clearTimeout(loadingTimeout)

    loadingTimeout = setTimeout(() => {
      isLoading = true
    }, 100)
  }

  $: throttleLoading(!!$navigating || $loading)

  afterNavigate(navigation => {
    historyStore.addEntry(navigation.to?.url.pathname)
    returnURLStore.updateFromURL(navigation.to?.url)
  })
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<title>{$_('App Page Title')}</title>

<Toaster position="bottom-right" offset="1rem" class="toaster group {$footerNavbarActive ? 'mb-bottom-nav' : 'mb-0'}" />

<slot></slot>

{#if isLoading}
  <div class="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-background/30 backdrop-blur-sm">
    <div transition:scale={{ duration: 150, start: 0.8 }} class="flex flex-col items-center">
      <IcoNoir.ArkeLogoOnly class="w-12 animate-spin-slow" />

      {#if $loadingMessage}
        <p class="mt-4 text-sm font-medium text-stone-600 dark:text-stone-300">{$loadingMessage}</p>
      {/if}
    </div>
  </div>
{/if}
