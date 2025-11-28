<script lang="ts">
  export let flush: boolean = false
</script>

<p class="text-sm {$$restProps.class || ''}" class:my-2={!flush}>
  <slot />
</p>
