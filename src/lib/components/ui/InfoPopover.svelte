<script lang="ts">
  import * as Popover from '$ds/components/ui/popover'
  import type { ComponentType } from 'svelte'
  import { IconSize } from '$ds/components/icons/iconoir'
    import { Info } from 'lucide-svelte'

  export let icon: ComponentType = Info
  export let iconSize: string = IconSize.Small
  export let side: 'top' | 'bottom' | 'left' | 'right' = 'top'
  export let contentClass: string = 'min-w-96'
</script>

<Popover.Root>
  <Popover.Trigger>
    <div class="text-muted-foreground/70 flex items-center justify-center">
      <svelte:component this={icon} class={iconSize} />
    </div>
  </Popover.Trigger>
  <Popover.Content class="{contentClass} p-0" {side}>
    <div class="bg-muted/50 flex h-11 items-center border-b px-4 text-sm font-semibold">
      <slot name="title" />
    </div>
    <div class="p-4 text-sm">
      <slot />
    </div>
  </Popover.Content>
</Popover.Root>
