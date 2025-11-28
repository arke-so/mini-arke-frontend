<script lang="ts">
  import { SalesChannelSummaryStatusEnum } from '$api/sales'
  import type { StatusType } from '$components/badges/ColoredLabel.svelte'
  import ColoredLabel from '$components/badges/ColoredLabel.svelte'
  import { _ } from 'svelte-i18n'

  export let status: SalesChannelSummaryStatusEnum = SalesChannelSummaryStatusEnum.Active
  export let minimal: boolean = false

  function statusToVariant(status: SalesChannelSummaryStatusEnum): StatusType {
    switch (status) {
      case SalesChannelSummaryStatusEnum.Active:
        return 'success'
      default:
        return 'default'
    }
  }

  function getStatusLabel(status: SalesChannelSummaryStatusEnum): string {
    switch (status) {
      case SalesChannelSummaryStatusEnum.Active:
        return $_('Active')
      default:
        return $_('Disabled')
    }
  }

  $: label = getStatusLabel(status)
  $: variant = statusToVariant(status)
</script>

<ColoredLabel {variant} {label} {minimal} {...$$restProps} />
