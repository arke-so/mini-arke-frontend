<script lang="ts">
  import { TableClass } from '.'

  export let flush: boolean = false
  export let main: boolean = false
  export let linear: boolean = false
</script>

<div
  class="cell {linear
    ? ''
    : 'table-cell border-b-0 border-r-0 first:border-l-0 group-last:border-b group-first-of-type:border-t-0'} border border-stone-200 align-middle dark:border-stone-700 {$$restProps.class ||
    ''} {main && !linear ? TableClass.MainCell : ''}"
  class:px-2={!flush}>
  <slot />
</div>
