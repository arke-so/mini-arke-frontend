<script lang="ts">
  import { fly } from 'svelte/transition'

  export let key: string
  export let duration: number = 200

  const distance = 10
</script>

{#key key}
  <div in:fly={{ y: distance, duration, delay: duration }} out:fly={{ y: distance, duration }}>
    <slot />
  </div>
{/key}
