<script lang="ts">
  import { onMount } from 'svelte'

  export let delay: number = 600

  let rendered: boolean = false

  onMount(() => {
    setTimeout(() => {
      rendered = true
    }, delay)
  })
</script>

{#if rendered}
  <slot />
{/if}
