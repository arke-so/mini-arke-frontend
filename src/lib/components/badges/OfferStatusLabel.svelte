<script lang="ts">
  import type { OfferDetailsStatusEnum } from '$api/sales'
  import ColoredLabel, { type StatusType } from '$components/badges/ColoredLabel.svelte'
  import { _ } from 'svelte-i18n'

  export let status: OfferDetailsStatusEnum = 'draft'
  export let minimal: boolean = false

  function statusToVariant(status: OfferDetailsStatusEnum): StatusType {
    switch (status) {
      case 'sent':
        return 'info'
      case 'accepted':
        return 'success'
      case 'rejected':
        return 'warning'

      default:
        return 'default'
    }
  }

  function getLabel(status: OfferDetailsStatusEnum): string {
    switch (status) {
      case 'sent':
        return $_('Sent')
      case 'accepted':
        return $_('Accepted')
      case 'rejected':
        return $_('Rejected')

      default:
        return $_('Draft')
    }
  }

  $: label = getLabel(status)
  $: variant = statusToVariant(status)
</script>

<ColoredLabel {variant} {label} {minimal} {...$$restProps} />
