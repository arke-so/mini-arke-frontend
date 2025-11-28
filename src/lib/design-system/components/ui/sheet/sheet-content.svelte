<script lang="ts">
  import { cn } from '$ds/utils.js'
  import { Dialog as SheetPrimitive } from 'bits-ui'
  import Cross2 from 'svelte-radix/Cross2.svelte'
  import { fly } from 'svelte/transition'
  import { SheetOverlay, SheetPortal, type Side, sheetTransitions, sheetVariants } from './index.js'

  type $$Props = SheetPrimitive.ContentProps & {
    side?: Side
    defaultCloseButton?: boolean
    overlay?: boolean
  }

  let className: $$Props['class'] = undefined
  export let side: $$Props['side'] = 'right'
  export let overlay: $$Props['overlay'] = true

  export { className as class }
  export let inTransition: $$Props['inTransition'] = fly
  export let inTransitionConfig: $$Props['inTransitionConfig'] = sheetTransitions[side ?? 'right'].in
  export let outTransition: $$Props['outTransition'] = fly
  export let outTransitionConfig: $$Props['outTransitionConfig'] = sheetTransitions[side ?? 'right'].out
  export let defaultCloseButton: boolean = true
</script>

<SheetPortal>
  {#if overlay}
    <SheetOverlay />
  {/if}
  <SheetPrimitive.Content
    {inTransition}
    {inTransitionConfig}
    {outTransition}
    {outTransitionConfig}
    class={cn(sheetVariants({ side }), className)}
    {...$$restProps}>
    <slot />

    {#if defaultCloseButton}
      <SheetPrimitive.Close
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <Cross2 class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </SheetPrimitive.Close>
    {/if}
  </SheetPrimitive.Content>
</SheetPortal>
