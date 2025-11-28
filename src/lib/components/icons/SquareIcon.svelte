<script lang="ts">
  export let icon: ConstructorOfATypedSvelteComponent | null = null
  export let iconClass: string = ''
</script>

<div class="flex shrink-0 items-center justify-center rounded-md border {$$restProps.class || 'size-9 bg-border/50'}">
  {#if icon}
    <svelte:component this={icon} class="size-4 {iconClass}" />
  {/if}
</div>
