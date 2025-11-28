<script lang="ts">
  import type { MissingRawMaterial } from '$api/supply'
  import type { ExtendedOption } from '$utils/generics'
  import { _ } from 'svelte-i18n'

  export let items: Array<ExtendedOption<MissingRawMaterial & { alternativesCount: number }>> = []
  export let placeholder: string = ''

  $: selected = items[0]
  $: alternativesCount = selected?.attr?.alternatives?.length || selected?.attr?.alternativesCount || 0
</script>

{#if selected}
  <div class="flex flex-1 flex-wrap items-center justify-between">
    <span class="truncate font-semibold">{selected.label}</span>

    {#if alternativesCount > 0}
      <span class="text-xs text-muted-foreground">
        {$_('See Count Alternatives', { values: { count: alternativesCount } })}
      </span>
    {/if}
  </div>
{:else}
  <div class="flex items-center">
    {placeholder}
  </div>
{/if}
