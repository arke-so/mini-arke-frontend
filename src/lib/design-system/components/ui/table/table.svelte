<script lang="ts">
  import { cn } from '$ds/utils.js'
  import type { HTMLTableAttributes } from 'svelte/elements'

  export let infiniteScroll = false

  type $$Props = HTMLTableAttributes & {
    infiniteScroll?: boolean
  }

  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<div class="w-full" class:relative={!infiniteScroll} class:overflow-auto={!infiniteScroll}>
  <table class={cn('w-full caption-bottom text-sm', className)} {...$$restProps}>
    <slot />
  </table>
</div>
