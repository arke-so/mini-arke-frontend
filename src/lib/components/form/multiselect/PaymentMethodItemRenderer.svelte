<script lang="ts">
  import { PaymentMethodSource } from '$fixtures/payment-method'
  import type { ExtendedOption } from '$utils/generics'
  import Building2 from 'lucide-svelte/icons/building-2'
  import User from 'lucide-svelte/icons/user'
  import { _ } from 'svelte-i18n'

  export let option: ExtendedOption

  $: source = option.attr?.source
  $: sourceLabel =
    source === PaymentMethodSource.TENANT
      ? $_('From Company')
      : source === PaymentMethodSource.CUSTOMER
        ? $_('From Customer')
        : null
  $: sourceIcon =
    source === PaymentMethodSource.TENANT ? Building2 : source === PaymentMethodSource.CUSTOMER ? User : null
</script>

<div class="flex w-full items-center justify-between gap-2">
  <div class="flex-1 truncate">
    {option.label}
  </div>
  {#if sourceLabel && sourceIcon}
    <div class="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
      <svelte:component this={sourceIcon} class="h-3 w-3" />
      <span class="whitespace-nowrap">{sourceLabel}</span>
    </div>
  {/if}
</div>
