<script lang="ts">
  import type { StatusType } from '$components/badges/ColoredLabel.svelte'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'

  export let variant: StatusType = 'default'
  export let iconClass: string = IconSize.Button
  export let icon: ConstructorOfATypedSvelteComponent | undefined = undefined

  const color: Record<StatusType, string> = {
    success: 'border-success bg-success/20 text-success',
    error: 'border-error bg-error/20 text-error',
    info: 'border-info bg-info/20 text-info',
    warning: 'bg-warning/20 text-warning border-warning',
    default: 'border-stone-300 dark:border-stone-500 text-stone-300',
  }

  const icons: Record<StatusType, ConstructorOfATypedSvelteComponent> = {
    success: IcoNoir.Check,
    error: IcoNoir.Minus,
    info: IcoNoir.Minus,
    warning: IcoNoir.Minus,
    default: IcoNoir.Minus,
  }

  $: colorClass = color[variant]
  $: IconBuilder = icon || icons[variant]
</script>

<div
  class="flex flex-shrink-0 items-center justify-center rounded-full border {colorClass} {$$restProps.class ||
    'h-5 w-5'}">
  <svelte:component this={IconBuilder} class={iconClass} />
</div>
