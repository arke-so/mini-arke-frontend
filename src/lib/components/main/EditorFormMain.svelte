<script lang="ts">
  import { onMount } from 'svelte'
  import LimitedWidthContent from './LimitedWidthContent.svelte'

  onMount(() => {
    document.body.classList.add('overflow-hidden')

    return () => document.body.classList.remove('overflow-hidden')
  })
</script>

<main
  class="h-[calc(theme(height.viewport)_-_theme(spacing.navigation)_-_theme(spacing.navigation))] w-full overflow-y-auto {$$restProps.class ||
    ''}">
  <LimitedWidthContent>
    <slot />
  </LimitedWidthContent>
</main>
