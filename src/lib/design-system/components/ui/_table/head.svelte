<script lang="ts">
  import { TableClass } from '.'

  export let main: boolean = false
</script>

<div
  class="table-cell h-10 border border-r-0 border-stone-200 px-2 align-middle font-medium text-muted-foreground first:border-l-0 dark:border-stone-700 {$$restProps.class ||
    ''} {main ? TableClass.MainCell : ''}">
  <slot />
</div>
