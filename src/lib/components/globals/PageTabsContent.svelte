<script lang="ts">
  import { page } from '$app/stores'
  import { PageTab } from '$fixtures/tabs'

  export let tabId: string = PageTab.Details
  export let paramName: string = 'tab'
  export let lazyLoad: boolean | undefined = undefined

  $: isActive = ($page.url.searchParams.get(paramName) || PageTab.Details) === tabId
</script>

{#if !lazyLoad || isActive}
  <div class={$$restProps.class || ''} aria-hidden={!isActive} class:hidden={!isActive}>
    <slot active={isActive} />
  </div>
{/if}
