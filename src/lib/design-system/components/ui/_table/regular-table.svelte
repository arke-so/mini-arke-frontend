<script lang="ts">
  /**
   * If true, the table header will be sticky at the top of the table.
   */
  export let sticky: boolean = false

  /**
   * If true, the table will be displayed as block elements in a column layout.
   * It should be considered as the last resort, for very edge cases where a table layout is not suitable.
   */
  export let linear: boolean = false
</script>

<div class="{linear ? 'flex flex-col' : 'table'} w-full align-middle text-sm {$$restProps.class || ''}">
  <div class="thead top-0 table-header-group bg-background" class:sticky>
    {#if !linear}
      <slot name="thead" {linear} />
    {/if}
  </div>

  <slot name="tbody" {linear} />
</div>
