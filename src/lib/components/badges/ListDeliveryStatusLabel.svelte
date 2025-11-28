<script lang="ts">
  import type { OrderSummaryStatusEnum as SalesOrderSummaryStatusEnum } from '$api/sales'
  import type { OrderSummaryStatusEnum } from '$api/supply'
  import ColoredLabel, { type StatusType } from '$components/badges/ColoredLabel.svelte'
  import { _ } from 'svelte-i18n'

  export let inStock: number = 0
  export let inbound: number = 0
  export let minimal: boolean = false
  export let status: OrderSummaryStatusEnum | SalesOrderSummaryStatusEnum = 'draft'

  function getVariant(stock: number, delivery: number): StatusType {
    if (stock > 0 && delivery > 0) {
      return 'warning'
    } else if (!stock && delivery > 0) {
      return 'default'
    } else if (status === 'accepted' && delivery <= 0) {
      return 'success'
    }

    return 'default'
  }

  function getLabel(stock: number, delivery: number): string {
    if (stock > 0 && delivery > 0) {
      return $_('Partially Received')
    } else if (!stock && delivery > 0) {
      return $_('Pending')
    } else if (status === 'accepted' && delivery <= 0) {
      return $_('Received')
    }

    return $_('Pending')
  }

  $: label = getLabel(inStock, inbound)
  $: variant = getVariant(inStock, inbound)
</script>

<ColoredLabel {variant} {label} {minimal} />
