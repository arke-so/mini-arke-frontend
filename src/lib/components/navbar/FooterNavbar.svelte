<script lang="ts">
  import { footerNavbarActive } from '$stores/app'
  import { onMount } from 'svelte'

  export let fixed: boolean = false

  onMount(() => {
    footerNavbarActive.set(true)

    return () => footerNavbarActive.set(false)
  })
</script>

<nav
  class:fixed
  class="bottom-0 left-0 z-40 flex h-navigation w-full items-center gap-4 bg-background px-4 max-md:border-t">
  <div class="flex flex-1 items-center justify-end gap-2 {$$restProps.class || ''}">
    <slot />
  </div>
</nav>

<style>
  nav {
    view-transition-name: footer;
  }
</style>
