<script lang="ts">
  import { IconSize } from '$ds/components/icons/iconoir'
  import { Button } from '$ds/components/ui/button'
  import * as Tooltip from '$ds/components/ui/tooltip'

  export let icon: ConstructorOfATypedSvelteComponent
  export let iconClass: string = IconSize.Button
  export let openDelay: number = 200
  export let closeDelay: number = 0
</script>

<Tooltip.Root {openDelay} {closeDelay} disableHoverableContent>
  <Tooltip.Trigger asChild let:builder>
    <Button size="icon" variant="link" builders={[builder]} tabindex={-1}>
      <svelte:component this={icon} class={iconClass} />
    </Button>
  </Tooltip.Trigger>
  <Tooltip.Content class="max-w-52">
    <slot />
  </Tooltip.Content>
</Tooltip.Root>
