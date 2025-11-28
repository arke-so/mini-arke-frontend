<script lang="ts">
  import { OrderDetailsStatusEnum, QuoteDetailsStatusEnum } from '$api/sales'
  import ColoredLabel, { type StatusType } from '$components/badges/ColoredLabel.svelte'
  import { getOrderStatusLabelKey } from '$utils/orders'
  import { _ } from 'svelte-i18n'

  export let status: OrderDetailsStatusEnum | QuoteDetailsStatusEnum = OrderDetailsStatusEnum.Draft
  export let minimal: boolean = false

  function statusToVariant(status: OrderDetailsStatusEnum | QuoteDetailsStatusEnum): StatusType {
    switch (status) {
      case OrderDetailsStatusEnum.Sent:
        return 'info'
      case OrderDetailsStatusEnum.Accepted:
        return 'success'
      case QuoteDetailsStatusEnum.Rejected:
      case OrderDetailsStatusEnum.Draft:
        return 'default'

      default:
        return 'default'
    }
  }

  $: label = $_(getOrderStatusLabelKey(status))
  $: variant = statusToVariant(status)
</script>

<ColoredLabel {variant} {label} {minimal} {...$$restProps} />
