<script lang="ts">
  import { onMount } from 'svelte'
  import { MainClass } from './main'

  export let flush: boolean = false

  onMount(() => {
    document.body.classList.add('overflow-hidden')

    return () => document.body.classList.remove('overflow-hidden')
  })
</script>

<main class:p-4={!flush} class="flex-1 overflow-auto {MainClass.Layout} {$$restProps.class || ''}">
  <slot />
</main>
