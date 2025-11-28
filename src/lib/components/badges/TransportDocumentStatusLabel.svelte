<script lang="ts">
  import type { TransportDocumentDetailsStatusEnum } from '$api/supply'
  import ColoredLabel, { type StatusType } from '$components/badges/ColoredLabel.svelte'
  import { _ } from 'svelte-i18n'

  export let status: TransportDocumentDetailsStatusEnum = 'inbound'
  export let minimal: boolean = false

  function getVariant(sts: TransportDocumentDetailsStatusEnum): StatusType {
    if (sts === 'accepted') {
      return 'success'
    }

    return 'default'
  }

  function getLabel(sts: TransportDocumentDetailsStatusEnum): string {
    if (sts === 'accepted') {
      return $_('Reviewed')
    }

    return $_('Draft')
  }

  $: label = getLabel(status)
  $: variant = getVariant(status)
</script>

<ColoredLabel {variant} {label} {minimal} {...$$restProps} />
