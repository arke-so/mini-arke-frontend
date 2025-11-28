<script lang="ts">
  export let highlightRows: boolean = false
  export let linear: boolean = false
</script>

<table-row
  class="group {linear ? '!mb-4' : 'table-row'} {highlightRows
    ? 'hover:bg-muted/70 dark:hover:bg-muted/50'
    : ''} {$$restProps.class || ''}">
  <slot />
</table-row>
