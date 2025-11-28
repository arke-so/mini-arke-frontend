<script lang="ts">
  import LabelBadge from '$components/badges/LabelBadge.svelte'
  import type { ExtendedOption } from '$utils/generics'

  export let items: Array<ExtendedOption> = []
  export let removeItem: (item: ExtendedOption, event: MouseEvent) => void = () => {}
  export let placeholder: string
  export let colored: boolean = true
</script>

<div class="flex flex-wrap gap-1">
  {#each items as item, index}
    <LabelBadge {index} {colored} removable on:click={event => removeItem(item, event)}>
      {item.label}
    </LabelBadge>
  {:else}
    {placeholder}
  {/each}
</div>
