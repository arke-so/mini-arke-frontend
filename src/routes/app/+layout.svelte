<script lang="ts">
  import SpotlightSearch from '$components/globals/SpotlightSearch.svelte'
  import { spotlightActive } from '$stores/app'
</script>

<div class="flex h-viewport flex-col antialiased">
  <slot />
</div>

<SpotlightSearch bind:open={$spotlightActive} />
