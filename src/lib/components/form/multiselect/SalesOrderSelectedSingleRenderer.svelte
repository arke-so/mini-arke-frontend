<script lang="ts">
  import type { ExtendedOption } from '$utils/generics'

  export let items: Array<ExtendedOption> = []
  export let placeholder: string = ''

  $: selected = items[0]
</script>

<div class="flex flex-wrap gap-1 truncate">
  {#if selected}
    {#if selected?.attr?.externalId}
      <div class="overflow-ellipsis">
        <span class="font-semibold">{selected?.attr?.externalId}</span>
        <span class="text-xs text-muted-foreground"> — {selected.label}</span>
      </div>
    {:else}
      <span class="font-semibold">{selected.label}</span>
    {/if}
  {:else}
    {placeholder}
  {/if}
</div>
