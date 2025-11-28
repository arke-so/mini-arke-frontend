<script lang="ts">
  import { ForecastDetailsStatusEnum } from '$api/sales'
  import ColoredLabel, { type StatusType } from '$components/badges/ColoredLabel.svelte'
  import { IcoNoir, IconSize } from '$ds/components/icons/iconoir'
  import { _ } from 'svelte-i18n'

  export let status: string | undefined
  export let minimal: boolean = false

  function getVariant(sts?: string): StatusType {
    switch (sts) {
      case ForecastDetailsStatusEnum.Accepted:
        return 'success'
      case ForecastDetailsStatusEnum.Draft:
        return 'default'
      case ForecastDetailsStatusEnum.Rejected:
        return 'error'
      default:
        return 'default'
    }
  }

  function getLabel(sts?: string): string {
    switch (sts) {
      case ForecastDetailsStatusEnum.Accepted:
        return $_('Order created')
      case ForecastDetailsStatusEnum.Draft:
        return $_('Draft')
      case ForecastDetailsStatusEnum.Rejected:
        return $_('Forecast Expired')
      default:
        return sts || ''
    }
  }

  $: label = getLabel(status)
  $: variant = getVariant(status)
</script>

<ColoredLabel {variant} {minimal} {...$$restProps}>
  {#if status === ForecastDetailsStatusEnum.Accepted}
    <div class="flex items-center gap-1">
      <IcoNoir.Check class={IconSize.Micro} />
      <span>{label}</span>
    </div>
  {:else}
    {label}
  {/if}
</ColoredLabel>
