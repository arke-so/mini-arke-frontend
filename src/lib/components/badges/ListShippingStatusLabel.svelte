<script lang="ts">
  import type { OrderSummaryShippedEnum } from '$api/sales'
  import ColoredLabel, { type StatusType } from '$components/badges/ColoredLabel.svelte'
  import { _ } from 'svelte-i18n'

  export let shippingStatus: OrderSummaryShippedEnum | undefined
  export let minimal: boolean = false

  function getVariant(status: OrderSummaryShippedEnum | undefined): StatusType {
    switch (status) {
      case 'completed':
        return 'success'
      case 'partial':
        return 'warning'
      default:
        return 'default'
    }
  }

  function getLabel(status: OrderSummaryShippedEnum | undefined): string {
    switch (status) {
      case 'completed':
        return $_('Shipped')
      case 'partial':
        return $_('Partially Shipped')
      default:
        return $_('Pending')
    }
  }

  $: label = getLabel(shippingStatus)
  $: variant = getVariant(shippingStatus)
</script>

<ColoredLabel {variant} {label} {minimal} />
