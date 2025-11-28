<script lang="ts">
  import ColoredLabel, { type StatusType } from '$components/badges/ColoredLabel.svelte'
  import { _ } from 'svelte-i18n'

  export let quantity: number = 0
  export let expectedQuantity: number = 0
  export let minimal: boolean = false

  function getVariant(qty: number, expectedQty: number): StatusType {
    if (qty === 0) {
      return 'default'
    }

    if (qty < expectedQty) {
      return 'info'
    }

    return 'success'
  }

  function getLabel(qty: number, expectedQty: number): string {
    if (qty === 0) {
      return $_('Pending')
    }

    if (qty < expectedQuantity) {
      return $_('Partially Received')
    }

    return $_('Received')
  }

  $: label = getLabel(quantity, expectedQuantity)
  $: variant = getVariant(quantity, expectedQuantity)
</script>

<ColoredLabel {variant} {label} {minimal} {...$$restProps} />
