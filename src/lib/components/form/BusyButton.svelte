<script lang="ts">
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { Button, type ButtonProps, type Variant } from '$ds/components/ui/button'
  import { _ } from 'svelte-i18n'
  import { scale } from 'svelte/transition'
  import IconButton from './IconButton.svelte'

  export let variant: Variant = 'default'
  export let size: ButtonProps['size'] = 'default'
  export let tooltip: string = ''
  export let busyLabel: string = $_('Please Wait')
  export let disabled: boolean = false
  export let busy: boolean = false
  export let builders: ButtonProps['builders'] = []
  export let focus: boolean = false

  let activated: boolean = false
  let internalBusy: boolean = false
  let timer: NodeJS.Timeout | null = null

  function onBusyChange(b: boolean) {
    if (b) {
      internalBusy = true
      if (timer) clearTimeout(timer)
      return
    }

    if (b === false) {
      timer = setTimeout(() => {
        activated = false
        internalBusy = false
      }, 400)
    }
  }

  $: onBusyChange(busy)
</script>

{#if size === 'icon'}
  <IconButton
    {variant}
    {builders}
    {focus}
    class={$$restProps.class || ''}
    tooltip={internalBusy ? busyLabel : tooltip}
    disabled={disabled || internalBusy}
    on:click={() => (activated = true)}
    on:click>
    {#if activated && internalBusy}
      <div in:scale={{ duration: 200 }}>
        <IcoNoir.Refresh class="{IconSize.Small} animate-spin" />
      </div>
    {:else}
      <slot />
    {/if}
  </IconButton>
{:else}
  <Button
    {size}
    {variant}
    {focus}
    class="transition-opacity duration-300 {$$restProps.class || ''}"
    disabled={disabled || internalBusy}
    builders={[...(builders || [])]}
    on:click={() => (activated = true)}
    on:click>
    {#if activated && internalBusy}
      <div in:scale={{ duration: 200 }}>
        <IcoNoir.Refresh class="{IconSize.Small} animate-spin" />
      </div>
      {#if busyLabel}
        <div class="ml-2">{busyLabel}</div>
      {/if}
    {:else}
      <slot />
    {/if}
  </Button>
{/if}
