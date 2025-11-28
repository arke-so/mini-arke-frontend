<script lang="ts">
  import { browser } from '$app/environment'
  import { base } from '$app/paths'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Button } from '$ds/components/ui/button'
  import { previousPage, shouldUseReferrer } from '$stores/history'
  import { _ } from 'svelte-i18n'

  export let fallbackHref: string = base
  export let iconOnly: boolean = false
  export let label: string = $_('Back')

  function handleClick(event: MouseEvent) {
    if (browser && window.opener) {
      event.preventDefault()
      window.close()
      return
    }
  }

  $: prevHref = $shouldUseReferrer ? $previousPage || fallbackHref : fallbackHref
</script>

<Button
  variant="secondary"
  class="gap-2 max-md:w-9 max-md:p-0 {$$restProps.class || ''} {iconOnly ? 'w-10 p-0' : ''}"
  href={prevHref}
  on:click={handleClick}>
  <slot>
    <IcoNoir.ArrowLeft class={IconSize.Small} />
    <span class="sr-only md:not-sr-only">{label}</span>
  </slot>
</Button>
