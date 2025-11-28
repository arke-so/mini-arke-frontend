<script lang="ts">
  import { IconSize } from '$ds/components/icons/iconoir'
  import { Button, type ButtonProps, type Variant } from '$ds/components/ui/button'
  import { ExternalLink } from 'lucide-svelte'
  import { _ } from 'svelte-i18n'
  import IconButton from './IconButton.svelte'

  export let href: string = ''
  export let variant: Variant = 'default'
  export let size: ButtonProps['size'] = 'default'
  export let tooltip: string = $_('Open In New Tab')
  export let disabled: boolean = false
  export let builders: ButtonProps['builders'] = []
  export let focus: boolean = false
  export let secondaryIcon = ExternalLink
</script>

<div class="inline-flex items-center">
  <Button
    {size}
    {variant}
    {focus}
    {href}
    {...href ? {} : { disabled }}
    class="rounded-r-none {$$restProps.class || ''}"
    builders={[...(builders || [])]}>
    <slot />
  </Button>
  <div class="h-full">
    <IconButton
      {variant}
      {disabled}
      {tooltip}
      class="rounded-l-none border-l border-gray-400 {$$restProps.class || ''}"
      {href}
      target="_blank">
      <svelte:component this={secondaryIcon} class={IconSize.Small} />
    </IconButton>
  </div>
</div>
