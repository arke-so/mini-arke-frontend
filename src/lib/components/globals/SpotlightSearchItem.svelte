<script lang="ts">
  import type { SearchDoc } from '$api/infra'
  import * as Command from '$ds/components/ui/command'

  export let result: SearchDoc
  export let icon: ConstructorOfATypedSvelteComponent
  export let label: string = ''
  export let onSelect = (value: string) => {}
</script>

<Command.Item value={result.id} {onSelect}>
  <svelte:component this={icon} class="mr-2 w-6 text-stone-400" />

  <div>
    <slot>{result.name}</slot>
  </div>

  {#if label}
    <div class="ml-auto max-w-36 truncate text-xs text-muted-foreground">{label}</div>
  {/if}
</Command.Item>
