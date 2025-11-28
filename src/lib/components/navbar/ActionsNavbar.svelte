<script lang="ts">
  import BackButton from '$components/utils/BackButton.svelte'
  import { fly } from 'svelte/transition'

  export let backHref: string | undefined = undefined
</script>

<nav
  class="flex h-navigation w-full items-center gap-4 bg-background px-4 max-md:border-b"
  in:fly={{ y: -20, duration: 400 }}>
  <div class="flex flex-1">
    <slot name="back">
      {#if backHref}
        <BackButton fallbackHref={backHref} />
      {/if}
    </slot>
  </div>

  <div class="flex flex-none justify-center md:hidden md:w-2/6">
    <div class="">
      <slot name="title" />
    </div>
  </div>

  <div class="flex flex-1 items-center justify-end gap-2">
    <slot name="actions" />
  </div>
</nav>

<style>
  nav {
    view-transition-name: navbar;
  }
</style>
