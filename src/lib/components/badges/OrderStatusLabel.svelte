<script lang="ts">
  import type { OrderDetailsStatusEnum } from '$api/supply'
  import ColoredLabel, { type StatusType } from '$components/badges/ColoredLabel.svelte'
  import { getOrderStatusLabelKey } from '$utils/orders'
  import { _ } from 'svelte-i18n'

  export let status: OrderDetailsStatusEnum = 'draft'
  export let minimal: boolean = false

  function statusToVariant(status: OrderDetailsStatusEnum): StatusType {
    switch (status) {
      case 'sent':
        return 'info'
      case 'accepted':
      case 'shipped':
        return 'success'

      case 'draft':
        return 'default'

      default:
        return 'default'
    }
  }

  $: label = $_(getOrderStatusLabelKey(status))
  $: variant = statusToVariant(status)
</script>

<ColoredLabel {variant} {label} {minimal} {...$$restProps} />
