<script lang="ts">
  import { Button, type ButtonProps, type Variant } from '$ds/components/ui/button'
  import * as Tooltip from '$ds/components/ui/tooltip'

  export let variant: Variant = 'default'
  export let tooltip: string = ''
  export let builders: ButtonProps['builders'] = []
</script>

<Tooltip.Root openDelay={200} disableHoverableContent>
  <Tooltip.Trigger asChild let:builder>
    <Button
      {variant}
      builders={[...(builders || []), builder]}
      size="icon"
      aria-label={tooltip}
      {...$$restProps}
      on:click>
      <slot />
    </Button>
  </Tooltip.Trigger>
  <Tooltip.Content>
    <p>{tooltip}</p>
  </Tooltip.Content>
</Tooltip.Root>
