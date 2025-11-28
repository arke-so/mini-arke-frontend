<script lang="ts">
  import { type StatusType } from '$components/badges/ColoredLabel.svelte'
  import { PriorityLevelsMap, PriorityLevelValue } from '$fixtures/orders'
  import { _ } from 'svelte-i18n'

  export let priority: number = 3
  export let minimal: boolean = false

  function priorityToVariant(priority: number): StatusType {
    switch (priority) {
      case PriorityLevelValue.VeryLow:
      case PriorityLevelValue.Low:
        return 'success'
      case PriorityLevelValue.Normal:
        return 'default'
      case PriorityLevelValue.Medium:
        return 'warning'
      case PriorityLevelValue.High:
        return 'error'
      default:
        return 'default'
    }
  }

  const color: Record<number, string> = {
    [PriorityLevelValue.VeryLow]: 'bg-stone-200/50 text-stone-700 border border-stone-700/10',
    [PriorityLevelValue.Low]: 'bg-success/10 text-success border-success/10 border',
    [PriorityLevelValue.Normal]: 'bg-success/20 text-success border-success/20 border',
    [PriorityLevelValue.Medium]: 'bg-amber-400/40 text-stone-700 border-amber-400/50 border dark:text-stone-300',
    [PriorityLevelValue.High]: 'bg-rose-400/40 text-stone-700 border-rose-400/30 border dark:text-stone-300',
  }

  const minimalColor: Record<number, string> = {
    [PriorityLevelValue.VeryLow]: 'text-green-600 dark:text-green-500',
    [PriorityLevelValue.Low]: 'text-success/60',
    [PriorityLevelValue.Normal]: 'text-success',
    [PriorityLevelValue.Medium]: 'text-amber-600 dark:text-orange-500',
    [PriorityLevelValue.High]: 'text-rose-700 dark:text-red-500',
  }

  $: colorClass = minimal ? minimalColor[priority] : color[priority]
  $: label = $_(PriorityLevelsMap[priority].label || PriorityLevelsMap[PriorityLevelValue.Normal].label)
</script>

<div
  class:rounded={!minimal}
  class:px-3={!minimal}
  class:py-0.5={!minimal}
  class:font-semibold={minimal}
  class="inline-block cursor-default whitespace-nowrap text-sm max-md:text-xs {colorClass} {$$restProps.class || ''}">
  <slot>{label}</slot>
</div>
