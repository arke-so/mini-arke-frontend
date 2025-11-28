<script lang="ts" context="module">
  export type StatusType = 'success' | 'error' | 'info' | 'warning' | 'default'
</script>

<script lang="ts">
  export let label: string = 'Label'
  export let variant: StatusType = 'default'
  export let minimal: boolean = false

  const color: Record<StatusType, string> = {
    success: 'bg-success/20 text-success border-success/30 border',
    error: 'bg-rose-400/40 text-stone-700 border-rose-400/30 border dark:text-stone-300',
    info: 'bg-info/20 text-info border border-info/30 border',
    warning: 'bg-amber-500/20 text-orange-700 dark:text-orange-200 border border-orange-700/20',
    default: 'bg-stone-200/50 text-stone-700 border border-stone-700/20',
  }

  const minimalColor: Record<StatusType, string> = {
    success: 'text-green-600 dark:text-green-500',
    error: 'text-red-600 dark:text-red-500',
    info: 'text-info dark:text-blue-500',
    warning: 'text-orange-600 dark:text-orange-500',
    default: 'text-stone-500 dark:text-stone-400',
  }

  $: colorClass = minimal ? minimalColor[variant] : color[variant]
</script>

<div
  class:rounded={!minimal}
  class:px-3={!minimal}
  class:py-0.5={!minimal}
  class:font-semibold={minimal}
  class="inline-block cursor-default whitespace-nowrap text-sm max-md:text-xs {colorClass} {$$restProps.class || ''}">
  <slot>{label}</slot>
</div>
