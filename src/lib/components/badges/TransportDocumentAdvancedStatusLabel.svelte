<script lang="ts">
  import type { OutboundTransportDocumentSummaryStatusEnum, TransportDocumentSummaryStatusEnum } from '$api/supply'
  import ColoredLabel, { type StatusType } from '$components/badges/ColoredLabel.svelte'
  import { _ } from 'svelte-i18n'
  export let status: TransportDocumentSummaryStatusEnum | OutboundTransportDocumentSummaryStatusEnum
  export let minimal: boolean = false
  function statusToVariant(
    status:
      | (typeof TransportDocumentSummaryStatusEnum)[keyof typeof TransportDocumentSummaryStatusEnum]
      | (typeof OutboundTransportDocumentSummaryStatusEnum)[keyof typeof OutboundTransportDocumentSummaryStatusEnum],
  ): { variant: StatusType; label: string } {
    switch (status) {
      case 'accepted':
        return { variant: 'success', label: $_('Approved') }
      case 'inbound':
      case 'draft':
        return { variant: 'default', label: $_('Draft') }
    }
  }
  $: ({ variant, label } = statusToVariant(status))
</script>

<ColoredLabel {variant} {label} {minimal} {...$$restProps} />
