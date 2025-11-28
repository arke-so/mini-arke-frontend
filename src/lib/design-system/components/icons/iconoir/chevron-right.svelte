<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements'

  type $$Props = SVGAttributes<SVGElement>
</script>

<svg stroke-width="1.5" viewBox="0 0 24 24" fill="none" color="currentColor" {...$$restProps}>
  <path
    d="M9 6L15 12L9 18"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    {...$$restProps}></path>
</svg>
