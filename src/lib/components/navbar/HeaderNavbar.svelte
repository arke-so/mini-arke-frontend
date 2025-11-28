<script lang="ts">
  export let fixed: boolean = false
</script>

<nav class:fixed class="left-0 top-0 z-40 flex h-navigation w-full items-center gap-4 border-b bg-background px-4">
  <slot />
</nav>
