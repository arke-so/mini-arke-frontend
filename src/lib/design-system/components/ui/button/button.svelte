<script lang="ts">
  import { cn } from '$ds/utils.js'
  import { Button as ButtonPrimitive } from 'bits-ui'
  import { type Events, type Props, buttonVariants } from './index.js'

  type $$Props = Props
  type $$Events = Events

  let className: $$Props['class'] = undefined
  let el: HTMLButtonElement

  export let variant: $$Props['variant'] = 'default'
  export let size: $$Props['size'] = 'default'
  export let builders: $$Props['builders'] = []
  export let focus: boolean = false
  export { className as class }

  $: if (focus && el) el.focus()
</script>

<ButtonPrimitive.Root
  {builders}
  class={cn(buttonVariants({ variant, size, className }))}
  type="button"
  bind:el
  {...$$restProps}
  on:click
  on:keydown>
  <slot />
</ButtonPrimitive.Root>
